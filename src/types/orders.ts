export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  shipping_address: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  invoice_number: string | null;
  invoice_data: Record<string, any> | null;
  applied_coupon_id: string | null;
  discount_amount: number | null;
  updated_by: string | null;
  tracking_number: string | null;
  billing_address: Record<string, any> | null;
  payment_status: string | null;
  payment_method: string | null;
  notes: string | null;
  payment_id: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  order_status_history: Array<{
    id: string;
    status: OrderStatus;
    created_at: string;
    notes?: string;
  }>;
}