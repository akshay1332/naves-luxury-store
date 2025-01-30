import { Database } from "@/integrations/supabase/types";

export type Order = Database["public"]["Tables"]["orders"]["Row"] & {
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
      type: "upload" | "link";
      url: string;
      instructions?: string;
    };
  };
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
  tracking_info?: {
    number?: string;
    url?: string;
    carrier?: string;
  };
  timestamps?: {
    processed_at?: string;
    shipped_at?: string;
    delivered_at?: string;
    cancelled_at?: string;
  };
};

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderAnalytics {
  order_date: string;
  total_orders: number;
  total_revenue: number;
  cod_orders: number;
  pending_payments: number;
  completed_payments: number;
  average_order_value: number;
  custom_design_orders: number;
} 