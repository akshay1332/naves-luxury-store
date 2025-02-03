export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  shipping_address: any;
  created_at: string;
  updated_at: string;
  invoice_number: string | null;
  invoice_data: any;
  applied_coupon_id: string | null;
  discount_amount: number | null;
  updated_by: string | null;
  tracking_number: string | null;
  billing_address: any;
  payment_status: string | null;
  payment_method: string | null;
  notes: string | null;
  payment_id: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  order_status_history: Array<{
    id: string;
    order_id: string;
    status: OrderStatus;
    notes?: string;
    changed_by?: string;
    created_at: string;
  }>;
}