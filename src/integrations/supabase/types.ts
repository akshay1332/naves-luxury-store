export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      coupons: {
        Row: DatabaseCoupon;
      };
      orders: {
        Row: Order;
      };
      products: {
        Row: Product;
      };
      profiles: {
        Row: ProfileData;
      };
    };
  };
}

export type DatabaseCoupon = {
  id: string;
  code: string;
  description: string | null;
  category: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount: number;
  max_discount_amount: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  usage_limit: number;
  times_used: number;
  product_id: string | null;
  created_at?: string;
  updated_at?: string;
};

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
  shipping_address: Json;
  billing_address: Json;
  created_at: string;
  updated_at: string;
  invoice_number: string;
  invoice_data: Json;
  applied_coupon_id: string | null;
  discount_amount: number;
  payment_status: string;
  payment_method: string;
  notes: string | null;
  payment_id: string | null;
  order_status_history: Array<{
    id: string;
    status: OrderStatus;
    created_at: string;
    notes?: string;
  }>;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  sizes: string[];
  colors: string[];
  images: string[];
  stock_quantity: number;
  category: string;
  gender: string;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_trending: boolean;
  style_category: string;
  created_at: string;
  updated_at: string;
  quick_view_data: {
    material: string;
    fit: string;
    care_instructions: string[];
    features: string[];
  };
  coupons?: DatabaseCoupon[];
}

export interface ProfileData {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean | null;
  created_at: string;
  updated_at: string;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  notification_preferences: Record<string, unknown> | null;
}