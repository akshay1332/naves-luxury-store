-- First, let's ensure we have all the necessary columns with proper types
ALTER TABLE orders
  ALTER COLUMN status SET DEFAULT 'pending',
  ALTER COLUMN status SET NOT NULL,
  ALTER COLUMN invoice_number SET NOT NULL,
  ALTER COLUMN total_amount SET NOT NULL,
  ALTER COLUMN user_id SET NOT NULL;

-- Update the invoice_data JSONB schema to ensure it follows our structure
ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS invoice_data_check;

ALTER TABLE orders
  ADD CONSTRAINT invoice_data_check CHECK (
    jsonb_typeof(invoice_data) = 'object' AND
    (invoice_data ? 'items') AND
    jsonb_typeof(invoice_data->'items') = 'array' AND
    (invoice_data ? 'payment_method') AND
    (
      (invoice_data->'custom_design') IS NULL OR
      (
        jsonb_typeof(invoice_data->'custom_design') = 'object' AND
        (invoice_data->'custom_design' ? 'type') AND
        (invoice_data->'custom_design' ? 'url') AND
        (invoice_data->'custom_design'->>'type' IN ('upload', 'link'))
      )
    )
  );

-- Update the shipping_address JSONB schema
ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS shipping_address_check;

ALTER TABLE orders
  ADD CONSTRAINT shipping_address_check CHECK (
    jsonb_typeof(shipping_address) = 'object' AND
    (shipping_address ? 'fullName') AND
    (shipping_address ? 'email') AND
    (shipping_address ? 'phone') AND
    (shipping_address ? 'address') AND
    (shipping_address ? 'city') AND
    (shipping_address ? 'state') AND
    (shipping_address ? 'zipCode') AND
    (shipping_address ? 'country')
  );

-- Add tracking information
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS tracking_url TEXT,
  ADD COLUMN IF NOT EXISTS shipping_carrier TEXT;

-- Add payment status tracking
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending',
  ADD CONSTRAINT payment_status_check CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'));

-- Add timestamps for various order stages
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;

-- Add order notes for admin
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Create an index for faster order lookups
CREATE INDEX IF NOT EXISTS idx_orders_user_id_created_at ON orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_invoice_number ON orders(invoice_number);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Create a function to update order timestamps based on status changes
CREATE OR REPLACE FUNCTION update_order_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'processing' AND OLD.status != 'processing' THEN
    NEW.processed_at = NOW();
  ELSIF NEW.status = 'shipped' AND OLD.status != 'shipped' THEN
    NEW.shipped_at = NOW();
  ELSIF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    NEW.delivered_at = NOW();
  ELSIF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    NEW.cancelled_at = NOW();
  END IF;
  
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for timestamp updates
DROP TRIGGER IF EXISTS update_order_timestamps ON orders;
CREATE TRIGGER update_order_timestamps
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_order_timestamps();

-- Add a view for easier order analytics
CREATE OR REPLACE VIEW order_analytics AS
SELECT
  DATE_TRUNC('day', created_at) as order_date,
  COUNT(*) as total_orders,
  SUM(total_amount) as total_revenue,
  COUNT(CASE WHEN invoice_data->>'payment_method' = 'cod' THEN 1 END) as cod_orders,
  COUNT(CASE WHEN payment_status = 'pending' THEN 1 END) as pending_payments,
  COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as completed_payments,
  AVG(total_amount) as average_order_value,
  COUNT(CASE WHEN invoice_data->'custom_design' IS NOT NULL THEN 1 END) as custom_design_orders
FROM orders
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY order_date DESC; 