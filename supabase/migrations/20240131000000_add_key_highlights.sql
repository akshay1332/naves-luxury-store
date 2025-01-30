-- Add key_highlights column to products table
ALTER TABLE products
ADD COLUMN key_highlights jsonb DEFAULT jsonb_build_object(
  'fit_type', 'Regular Fit',
  'fabric', '100% Cotton',
  'neck', 'Round Neck',
  'sleeve', 'Regular Sleeve',
  'pattern', 'Solid',
  'length', 'Regular'
); 