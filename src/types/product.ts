import { DatabaseCoupon } from './coupons';

export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  sizes: string[] | null;
  colors: string[] | null;
  images: string[] | null;
  is_featured: boolean | null;
  stock_quantity: number | null;
  created_at: string;
  updated_at: string;
  category: string | null;
  gender: string | null;
  is_best_seller: boolean | null;
  is_new_arrival: boolean | null;
  style_category: string | null;
  is_trending: boolean | null;
  quick_view_data: {
    material: string;
    fit: string;
    care_instructions: string[];
    features: string[];
  } | null;
  size_guide_info: Record<string, any> | null;
  sale_percentage: number | null;
  sale_start_date: string | null;
  sale_end_date: string | null;
  video_url: string | null;
  key_highlights: Record<string, any> | null;
  coupons?: DatabaseCoupon[];
}