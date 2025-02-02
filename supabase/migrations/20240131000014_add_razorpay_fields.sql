-- Add Razorpay specific fields to orders table
ALTER TABLE orders
ADD COLUMN razorpay_order_id text,
ADD COLUMN razorpay_payment_id text,
ADD COLUMN razorpay_signature text; 