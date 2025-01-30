-- First, drop all existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admin users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin users can update all profiles" ON profiles;

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = user_id
        AND is_admin = true
    );
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create new policies for profiles
CREATE POLICY "Enable read access for all users"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Enable update for users based on id"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Fix products table policies
DROP POLICY IF EXISTS "Enable all for admin" ON products;
CREATE POLICY "Enable read access for all authenticated users"
    ON products FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable write access for admin users"
    ON products FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- Fix reviews table policies
DROP POLICY IF EXISTS "Enable all for admin" ON reviews;
CREATE POLICY "Enable read access for all authenticated users"
    ON reviews FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON reviews FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update/delete for admin users"
    ON reviews FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- Fix testimonials table policies
DROP POLICY IF EXISTS "Enable all for admin" ON testimonials;
CREATE POLICY "Enable read access for all authenticated users"
    ON testimonials FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable write access for admin users"
    ON testimonials FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- Fix style_guides table policies
DROP POLICY IF EXISTS "Enable all for admin" ON style_guides;
CREATE POLICY "Enable read access for all authenticated users"
    ON style_guides FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable write access for admin users"
    ON style_guides FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- Fix recently_viewed table policies
DROP POLICY IF EXISTS "Enable all for admin" ON recently_viewed;
CREATE POLICY "Enable read access for own records"
    ON recently_viewed FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Enable insert/update for own records"
    ON recently_viewed FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_trending ON products(is_trending) WHERE is_trending = true;
CREATE INDEX IF NOT EXISTS idx_products_new_arrival ON products(is_new_arrival) WHERE is_new_arrival = true;
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_recently_viewed_user ON recently_viewed(user_id, viewed_at DESC); 