export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  shipping_address: Record<string, unknown>;
  billing_address: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  invoice_number: string;
  invoice_data: Record<string, unknown>;
  applied_coupon_id?: string;
  discount_amount: number;
  payment_status?: string;
  payment_method?: string;
  payment_id?: string;
  notes?: string;
  tracking_number?: string;
  order_items: OrderItem[];
  order_status_history: OrderStatusHistory[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  size?: string;
  color?: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  notes?: string;
  changed_by?: string;
  created_at: string;
}