export interface DatabaseCoupon {
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
  created_at: string | null;
  updated_at: string | null;
}

export type NewCoupon = Omit<DatabaseCoupon, 'id' | 'created_at' | 'updated_at' | 'times_used'>;