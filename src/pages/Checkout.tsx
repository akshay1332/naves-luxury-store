import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShippingAddressForm, type ShippingAddress } from "@/components/checkout/ShippingAddressForm";
import { ShippingMethod } from "@/components/checkout/ShippingMethod";
import { PaymentSection } from "@/components/checkout/PaymentSection";

const Checkout = () => {
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: cartItems } = await supabase
        .from('cart_items')
        .select(`
          quantity,
          products (
            id,
            price
          )
        `)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      const totalAmount = cartItems?.reduce((sum, item) => {
        return sum + (item.quantity * (item.products?.price || 0));
      }, 0) || 0;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          total_amount: totalAmount,
          shipping_address: shippingAddress,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

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

      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

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
          <PaymentSection loading={loading} />
        </form>
      </div>
    </div>
  );
};

export default Checkout;