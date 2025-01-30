-- First, drop existing policies for orders
DROP POLICY IF EXISTS "Enable all operations for admin users" ON orders;
DROP POLICY IF EXISTS "admin_full_access" ON orders;
DROP POLICY IF EXISTS "users_view_own_orders" ON orders;

-- Temporarily disable RLS
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders table
-- Allow users to view their own orders
CREATE POLICY "users_view_own_orders"
    ON orders FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Allow users to create their own orders
CREATE POLICY "users_create_own_orders"
    ON orders FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Allow admins to view all orders
CREATE POLICY "admins_view_all_orders"
    ON orders FOR SELECT
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- Allow admins to update any order
CREATE POLICY "admins_update_orders"
    ON orders FOR UPDATE
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- Allow admins to delete orders
CREATE POLICY "admins_delete_orders"
    ON orders FOR DELETE
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Add status enum type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Ensure orders table has all required columns
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS status order_status NOT NULL DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS shipping_address JSONB,
ADD COLUMN IF NOT EXISTS billing_address JSONB,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create trigger to update updated_at and updated_by
CREATE OR REPLACE FUNCTION update_orders_timestamp_and_user()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.updated_by = auth.uid();
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS update_orders_timestamp ON orders;
CREATE TRIGGER update_orders_timestamp
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_orders_timestamp_and_user(); 