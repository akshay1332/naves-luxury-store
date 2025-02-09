import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ShoppingBag, CreditCard, Truck, Upload, Link as LinkIcon, AlertCircle, Loader2 } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { loadRazorpayScript, createRazorpayOrder, initializeRazorpayPayment } from "@/lib/razorpay";
import { formatIndianPrice } from "@/lib/utils";

interface CheckoutFormData {
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: "card" | "upi" | "cod";
  wantCustomDesign: boolean;
  customDesignType: "upload" | "link" | null;
  customDesignFile?: File | null;
  customDesignLink?: string;
  specialInstructions?: string;
  wantsCustomPrinting: boolean;
  printingSize: 'Small' | 'Medium' | 'Large' | 'Across Chest' | null;
  printingLocations: string[];
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  allows_custom_printing?: boolean;
  custom_printing_options?: {
    small_locations: {
      left_chest: number;
      center_chest: number;
      right_chest: number;
      back: number;
    };
    medium_locations: {
      front: number;
      back: number;
      both: number;
    };
    large_locations: {
      full_front: number;
      full_back: number;
      both: number;
    };
    across_chest: number;
  };
  printing_guide?: {
    image_url: string;
    description: string;
    updated_at?: string;
  };
}

type CartItemType = Database['public']['Tables']['cart_items']['Row'] & {
  products: Database['public']['Tables']['products']['Row'];
};

const Checkout = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCouponId, setAppliedCouponId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState<CheckoutFormData>({
    shippingAddress: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
    paymentMethod: "cod",
    wantCustomDesign: false,
    customDesignType: null,
    customDesignFile: null,
    customDesignLink: "",
    specialInstructions: "",
    wantsCustomPrinting: false,
    printingSize: null,
    printingLocations: [],
  });
  const [product, setProduct] = useState<Product | null>(null);
  const [customPrintingPrice, setCustomPrintingPrice] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);

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

    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        quantity,
        size,
        color,
        products (
          id,
          title,
          price,
          sale_percentage,
          images,
          allows_custom_printing,
          custom_printing_options,
          printing_guide,
          delivery_charges,
          free_delivery_above
        )
      `)
      .eq('user_id', user.id)
      .returns<CartItemType[]>();

    if (error || !cartItems || cartItems.length === 0) {
      console.error('Error fetching cart items:', error);
      return;
    }

    // Set the first product's details (assuming single product checkout)
    const firstProduct = cartItems[0].products;
    if (firstProduct) {
      setProduct({
        id: firstProduct.id,
        title: firstProduct.title,
        price: firstProduct.price,
        allows_custom_printing: firstProduct.allows_custom_printing,
        custom_printing_options: firstProduct.custom_printing_options,
        printing_guide: firstProduct.printing_guide
      });

      // Calculate subtotal
      const total = cartItems.reduce((sum, item) => {
        const price = item.products?.price || 0;
        const salePercentage = item.products?.sale_percentage || 0;
        const discountedPrice = price * (1 - salePercentage / 100);
        return sum + (item.quantity * discountedPrice);
      }, 0);

      setSubtotal(total);

      // Calculate delivery charges
      const totalDeliveryCharges = cartItems.reduce((charges, item) => {
        const itemTotal = item.quantity * (item.products?.price || 0);
        const freeDeliveryAbove = item.products?.free_delivery_above || 499;
        const deliveryCharge = item.products?.delivery_charges || 0;

        if (itemTotal >= freeDeliveryAbove) {
          return charges;
        }
        return charges + deliveryCharge;
      }, 0);

      setDeliveryCharges(totalDeliveryCharges);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image under 2MB",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      customDesignFile: file,
    }));
  };

  const uploadCustomDesign = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${user?.id}-${Date.now()}.${fileExt}`;

    try {
      const { data, error } = await supabase.storage
        .from("custom-designs")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data: publicURL } = supabase.storage
        .from("custom-designs")
        .getPublicUrl(fileName);

      return publicURL.publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  // Calculate total with all components
  const calculateTotal = () => {
    return subtotal + customPrintingPrice - discountAmount + deliveryCharges;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let customDesignUrl = formData.customDesignLink || "";

      if (formData.wantCustomDesign && formData.customDesignType === "upload" && formData.customDesignFile) {
        customDesignUrl = await uploadCustomDesign(formData.customDesignFile);
      }

      const total = calculateTotal();
      const amountInPaise = Math.round(total * 100);

      // Get cart items for order
      const { data: cartItems } = await supabase
        .from('cart_items')
        .select(`
          quantity,
          size,
          color,
          products (
            id,
            title,
            price,
            images
          )
        `)
        .eq('user_id', user?.id);

      if (!cartItems || cartItems.length === 0) {
        throw new Error("Cart is empty");
      }

      // Format cart items for invoice_data
      const orderItems = cartItems.map(item => ({
        products: {
          id: item.products?.id,
          title: item.products?.title,
          price: item.products?.price,
          images: item.products?.images
        },
        quantity: item.quantity,
        size: item.size,
        color: item.color
      }));

      // Update the order data to include custom printing info
      const orderData = {
        user_id: user?.id,
        status: 'pending',
        total_amount: total,
        shipping_address: formData.shippingAddress,
        invoice_data: {
          items: orderItems,
          payment_method: formData.paymentMethod,
          custom_printing: formData.wantsCustomPrinting ? {
            price: customPrintingPrice,
            size: formData.printingSize,
            locations: formData.printingLocations,
            options: product?.custom_printing_options || {}
          } : null,
          ...(formData.wantCustomDesign && {
            custom_design: {
              type: formData.customDesignType,
              url: customDesignUrl,
              instructions: formData.specialInstructions
            }
          })
        },
        discount_amount: discountAmount,
        applied_coupon_id: appliedCouponId,
        payment_status: formData.paymentMethod === 'cod' ? 'pending' : 'paid'
      };

      if (formData.paymentMethod === 'cod') {
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert(orderData)
          .select()
          .single();

        if (orderError) throw orderError;

        // Update coupon usage for COD
        if (appliedCouponId) {
          await supabase.rpc('increment_coupon_usage', {
            coupon_id: appliedCouponId
          });
        }

        // Clear cart for COD
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user?.id);

        toast({
          title: "Order placed successfully",
          description: "Your order has been placed with Cash on Delivery.",
        });

        navigate('/profile');
      } else {
        // For online payments (card/UPI), create Razorpay order first
        const { data: razorpayOrder, error } = await supabase.functions.invoke('create-razorpay-order', {
          body: { amount: amountInPaise, orderId: `ORDER-${Date.now()}` }
        });

        if (error) throw error;

        // Load Razorpay script
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          throw new Error("Failed to load Razorpay SDK");
        }

        // Initialize payment
        const response = await initializeRazorpayPayment({
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: amountInPaise,
          currency: "INR",
          name: "CustomPrint",
          description: "Order Payment",
          order_id: razorpayOrder.id,
          prefill: {
            name: formData.shippingAddress.fullName,
            email: formData.shippingAddress.email,
            contact: formData.shippingAddress.phone,
          },
          handler: async (response: RazorpayResponse) => {
            // Create order after successful payment
            const { data: order, error: orderError } = await supabase
              .from('orders')
              .insert({
                ...orderData,
                invoice_data: {
                  ...orderData.invoice_data,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }
              })
              .select()
              .single();

            if (orderError) throw orderError;

            // Update coupon usage after successful payment
            if (appliedCouponId) {
              await supabase.rpc('increment_coupon_usage', {
                coupon_id: appliedCouponId
              });
            }

            // Clear cart after successful payment
            await supabase
              .from('cart_items')
              .delete()
              .eq('user_id', user?.id);

            toast({
              title: "Payment successful",
              description: "Your order has been placed successfully.",
            });

            navigate('/profile');
          },
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        variant: "destructive",
        title: "Checkout failed",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTotalPrice = (price: number) => {
    setCustomPrintingPrice(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <h1 className="text-3xl font-bold">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              <CheckoutForm
                formData={formData}
                setFormData={setFormData}
                handleFileChange={handleFileChange}
                uploadProgress={uploadProgress}
                loading={loading}
                product={product || undefined}
                updateTotalPrice={updateTotalPrice}
              />
            </div>

            {/* Order Summary */}
            <div>
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatIndianPrice(subtotal)}</span>
                  </div>
                  {customPrintingPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Custom Printing</span>
                      <span>{formatIndianPrice(customPrintingPrice)}</span>
                    </div>
                  )}
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatIndianPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery Charges</span>
                    {deliveryCharges === 0 ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <Truck className="h-4 w-4" />
                        <span>Free</span>
                      </div>
                    ) : (
                      <span>{formatIndianPrice(deliveryCharges)}</span>
                    )}
                  </div>

                  {deliveryCharges > 0 && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-700 flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <span>Some items in your cart have delivery charges. 
                        Increase your item quantity to qualify for free delivery.</span>
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total</span>
                      <span className="text-cyan-600">
                        {formatIndianPrice(calculateTotal())}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Delivery charges are calculated per item based on order value
                    </p>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;