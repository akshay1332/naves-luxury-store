-- Add new columns to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD CONSTRAINT products_gender_check CHECK (gender IN ('men', 'women', 'unisex')),
ADD COLUMN IF NOT EXISTS quick_view_data JSONB DEFAULT jsonb_build_object(
  'material', '',
  'fit', '',
  'care_instructions', ARRAY[]::text[],
  'features', ARRAY[]::text[]
),
ADD COLUMN IF NOT EXISTS key_highlights JSONB DEFAULT jsonb_build_object(
  'fit_type', 'Regular Fit',
  'fabric', '100% Cotton',
  'neck', 'Round Neck',
  'sleeve', 'Regular Sleeve',
  'pattern', 'Solid',
  'length', 'Regular'
),
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS style_category TEXT,
ADD COLUMN IF NOT EXISTS sale_percentage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sale_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS sale_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS video_url TEXT; 