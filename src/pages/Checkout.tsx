import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShippingAddressForm, type ShippingAddress } from "@/components/checkout/ShippingAddressForm";
import { ShippingMethod } from "@/components/checkout/ShippingMethod";
import { PaymentSection } from "@/components/checkout/PaymentSection";
import { CouponSection } from "@/components/checkout/CouponSection";

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCouponId, setAppliedCouponId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  useEffect(() => {
    checkAuth();
    calculateSubtotal();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to continue with checkout.",
      });
      navigate('/login');
    }
  };

  const calculateSubtotal = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: cartItems } = await supabase
      .from('cart_items')
      .select(`
        quantity,
        products (
          id,
          price,
          sale_percentage
        )
      `)
      .eq('user_id', user.id);

    const total = cartItems?.reduce((sum, item) => {
      const price = item.products?.price || 0;
      const salePercentage = item.products?.sale_percentage || 0;
      const discountedPrice = price * (1 - salePercentage / 100);
      return sum + (item.quantity * discountedPrice);
    }, 0) || 0;

    setSubtotal(total);
  };

  const handleCouponApplied = (discount: number, couponId: string) => {
    setDiscountAmount(discount);
    setAppliedCouponId(couponId);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data: cartItems } = await supabase
        .from('cart_items')
        .select(`
          quantity,
          products (
            id,
            price
          )
        `)
        .eq('user_id', user.id);

      const total = subtotal - discountAmount;

      // Create the order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          shipping_address: shippingAddress,
          status: 'pending',
          applied_coupon_id: appliedCouponId,
          discount_amount: discountAmount
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = cartItems?.map(item => ({
        order_id: order.id,
        product_id: item.products.id,
        quantity: item.quantity,
        price_at_time: item.products.price
      }));

      if (orderItems) {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      // Update coupon usage if one was applied
      if (appliedCouponId) {
        const { error: couponError } = await supabase
          .from('coupons')
          .update({ times_used: supabase.sql`times_used + 1` })
          .eq('id', appliedCouponId);

        if (couponError) throw couponError;
      }

      // Clear cart
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      toast({
        title: "Success",
        description: "Order placed successfully!",
      });

      navigate('/profile');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ShippingAddressForm
            shippingAddress={shippingAddress}
            setShippingAddress={setShippingAddress}
          />
          <ShippingMethod />
          <CouponSection
            subtotal={subtotal}
            onCouponApplied={handleCouponApplied}
          />
          <PaymentSection 
            loading={loading}
            subtotal={subtotal}
            discountAmount={discountAmount}
            total={subtotal - discountAmount}
          />
        </form>
      </div>
    </div>
  );
};

export default Checkout;