-- First, drop the existing constraint that's causing issues
ALTER TABLE orders DROP CONSTRAINT IF EXISTS invoice_data_check;

-- Add a more flexible constraint for invoice_data
ALTER TABLE orders ADD CONSTRAINT invoice_data_check CHECK (
  (invoice_data IS NULL) OR (
    jsonb_typeof(invoice_data) = 'object' AND
    CASE 
      WHEN invoice_data ? 'items' THEN jsonb_typeof(invoice_data->'items') = 'array'
      ELSE true
    END AND
    CASE 
      WHEN invoice_data ? 'custom_design' THEN 
        jsonb_typeof(invoice_data->'custom_design') = 'object' AND
        (
          (invoice_data->'custom_design'->>'type' IN ('upload', 'link')) OR
          (invoice_data->'custom_design'->>'type' IS NULL)
        )
      ELSE true
    END
  )
);

-- Drop and recreate shipping_address constraint to be more flexible
ALTER TABLE orders DROP CONSTRAINT IF EXISTS shipping_address_check;

ALTER TABLE orders ADD CONSTRAINT shipping_address_check CHECK (
  (shipping_address IS NULL) OR (
    jsonb_typeof(shipping_address) = 'object' AND
    shipping_address ? 'fullName' AND
    shipping_address ? 'email'
  )
);

-- Add a function to generate order analytics for a specific user
CREATE OR REPLACE FUNCTION get_user_order_analytics(user_id UUID)
RETURNS TABLE (
  total_orders BIGINT,
  total_spent NUMERIC,
  avg_order_value NUMERIC,
  most_ordered_product JSONB,
  custom_designs_count BIGINT,
  completed_orders BIGINT,
  pending_orders BIGINT,
  cancelled_orders BIGINT,
  cod_orders BIGINT,
  online_orders BIGINT,
  last_order_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  WITH user_orders AS (
    SELECT 
      o.*,
      o.invoice_data->'items' as items,
      jsonb_array_elements(o.invoice_data->'items') as item
    FROM orders o
    WHERE o.user_id = user_id
  ),
  product_counts AS (
    SELECT 
      item->>'title' as product_title,
      COUNT(*) as order_count,
      SUM((item->>'quantity')::int) as total_quantity
    FROM user_orders
    GROUP BY item->>'title'
    ORDER BY order_count DESC, total_quantity DESC
    LIMIT 1
  )
  SELECT
    COUNT(DISTINCT uo.id)::BIGINT as total_orders,
    SUM(uo.total_amount)::NUMERIC as total_spent,
    (SUM(uo.total_amount) / COUNT(DISTINCT uo.id))::NUMERIC as avg_order_value,
    jsonb_build_object(
      'title', pc.product_title,
      'order_count', pc.order_count,
      'total_quantity', pc.total_quantity
    ) as most_ordered_product,
    COUNT(DISTINCT CASE WHEN uo.invoice_data->'custom_design' IS NOT NULL THEN uo.id END)::BIGINT as custom_designs_count,
    COUNT(DISTINCT CASE WHEN uo.status = 'completed' THEN uo.id END)::BIGINT as completed_orders,
    COUNT(DISTINCT CASE WHEN uo.status = 'pending' THEN uo.id END)::BIGINT as pending_orders,
    COUNT(DISTINCT CASE WHEN uo.status = 'cancelled' THEN uo.id END)::BIGINT as cancelled_orders,
    COUNT(DISTINCT CASE WHEN uo.invoice_data->>'payment_method' = 'cod' THEN uo.id END)::BIGINT as cod_orders,
    COUNT(DISTINCT CASE WHEN uo.invoice_data->>'payment_method' != 'cod' THEN uo.id END)::BIGINT as online_orders,
    MAX(uo.created_at) as last_order_date
  FROM user_orders uo
  CROSS JOIN product_counts pc
  GROUP BY pc.product_title, pc.order_count, pc.total_quantity;
END;
$$ LANGUAGE plpgsql;

-- Create a view for user order statistics
CREATE OR REPLACE VIEW user_order_stats AS
WITH user_stats AS (
  SELECT
    u.id as user_id,
    u.email,
    COUNT(o.id) as total_orders,
    SUM(o.total_amount) as total_spent,
    COUNT(CASE WHEN o.status = 'completed' THEN 1 END) as completed_orders,
    COUNT(CASE WHEN o.status = 'pending' THEN 1 END) as pending_orders,
    COUNT(CASE WHEN o.invoice_data->'custom_design' IS NOT NULL THEN 1 END) as custom_designs,
    MAX(o.created_at) as last_order_date
  FROM profiles u
  LEFT JOIN orders o ON u.id = o.user_id
  GROUP BY u.id, u.email
)
SELECT
  us.*,
  CASE 
    WHEN total_orders > 10 THEN 'VIP'
    WHEN total_orders > 5 THEN 'Regular'
    ELSE 'New'
  END as customer_type,
  CASE
    WHEN total_spent > 50000 THEN 'High Value'
    WHEN total_spent > 20000 THEN 'Medium Value'
    ELSE 'Standard'
  END as customer_value
FROM user_stats us; 