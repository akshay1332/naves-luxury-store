import { DatabaseCoupon } from './coupons';

export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  gender: string | null;
  style_category: string | null;
  sizes: string[] | null;
  colors: string[] | null;
  images: string[] | null;
  stock_quantity: number | null;
  is_featured: boolean | null;
  is_best_seller: boolean | null;
  is_new_arrival: boolean | null;
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
  created_at: string;
  updated_at: string;
  coupons?: DatabaseCoupon[];
}