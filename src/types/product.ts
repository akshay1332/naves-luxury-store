export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  sizes?: string[];
  colors?: string[];
  images?: string[];
  is_featured?: boolean;
  stock_quantity?: number;
  category?: string;
  gender?: string;
  is_best_seller?: boolean;
  is_new_arrival?: boolean;
  style_category?: string;
  is_trending?: boolean;
  quick_view_data?: {
    material: string;
    fit: string;
    care_instructions: string[];
    features: string[];
  };
  size_guide_info?: Record<string, unknown>;
  sale_percentage?: number;
  sale_start_date?: string;
  sale_end_date?: string;
  video_url?: string;
  key_highlights?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}