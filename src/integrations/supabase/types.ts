export interface DatabaseCoupon {
  id: string;
  code: string;
  description?: string;
  category?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  discount_percentage: number;
  min_purchase_amount: number;
  max_discount_amount: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  usage_limit: number;
  times_used: number;
  product_id?: string;
  created_at?: string;
  updated_at?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  shipping_address?: Record<string, any>;
  billing_address?: Record<string, any>;
  created_at: string;
  updated_at: string;
  invoice_number?: string;
  invoice_data?: Record<string, any>;
  applied_coupon_id?: string;
  discount_amount?: number;
  payment_status?: string;
  payment_method?: string;
  notes?: string;
  order_status_history: Array<{
    id: string;
    status: OrderStatus;
    created_at: string;
    notes?: string;
  }>;
}