export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  shipping_address: Record<string, unknown>;
  billing_address?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  invoice_number?: string;
  invoice_data?: Record<string, unknown>;
  applied_coupon_id?: string;
  discount_amount?: number;
  payment_status?: string;
  payment_method?: string;
  payment_id?: string;
  notes?: string;
  tracking_number?: string;
  order_status_history?: Array<{
    id: string;
    status: OrderStatus;
    created_at: string;
    notes?: string;
  }>;
}