-- First, drop existing RLS policies for orders table
DROP POLICY IF EXISTS "Enable all operations for admin users" ON orders;

-- Disable RLS temporarily to ensure clean state
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create a new comprehensive policy for admin users
CREATE POLICY "admin_full_access" ON orders
    FOR ALL
    TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'admin'
        OR 
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    )
    WITH CHECK (
        auth.jwt() ->> 'role' = 'admin'
        OR 
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Create a policy for customers to view their own orders
CREATE POLICY "users_view_own_orders" ON orders
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Ensure the orders table has all necessary columns
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES users(id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.updated_by = auth.uid();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create or replace the trigger
DROP TRIGGER IF EXISTS update_orders_timestamp ON orders;
CREATE TRIGGER update_orders_timestamp
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_orders_updated_at(); 