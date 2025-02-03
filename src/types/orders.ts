export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  } | null;
  billing_address?: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  } | null;
  invoice_data: {
    items: {
      product: {
        id: string;
        title: string;
        price: number;
        images?: string[];
      };
      quantity: number;
      size?: string;
      color?: string;
    }[];
    payment_method: string;
    custom_design?: {
      type: 'link' | 'upload';
      url: string;
      instructions?: string;
    };
    subtotal: number;
    discount: number;
    total: number;
  };
  payment_status: PaymentStatus;
  payment_method?: string;
  payment_id?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  invoice_number?: string;
  notes?: string;
  discount_amount?: number;
  applied_coupon_id?: string;
  order_status_history?: Array<{
    status: OrderStatus;
    notes?: string;
    changed_by?: string;
    created_at: string;
  }>;
}