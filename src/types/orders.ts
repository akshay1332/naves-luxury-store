export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
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
  };
  billing_address?: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  invoice_data: {
    items: Array<{
      products: {
        id: string;
        title: string;
        price: number;
        images?: string[];
      };
      quantity: number;
      size?: string;
      color?: string;
    }>;
    payment_method: string;
    custom_design?: {
      type: 'upload' | 'link';
      url: string;
      instructions?: string;
    };
  };
  payment_status: PaymentStatus;
  payment_method?: string;
  payment_id?: string;
  tracking_info?: {
    number?: string;
    url?: string;
    carrier?: string;
  };
  created_at: string;
  updated_at: string;
  invoice_number?: string;
  notes?: string;
  discount_amount?: number;
  applied_coupon_id?: string;
}