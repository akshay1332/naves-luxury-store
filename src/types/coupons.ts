export interface DatabaseCoupon {
  id: string;
  code: string;
  description?: string;
  category?: string;
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

export interface CouponFormData {
  code: string;
  description?: string;
  category?: string;
  discount_percentage: number;
  min_purchase_amount: number;
  max_discount_amount: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  usage_limit: number;
  product_id?: string;
}