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
import { CouponSelector } from "@/components/checkout/CouponSelector";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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
  quantity: number;
};

type CartItem = {
  product_id: string;
  quantity: number;
  products: Product;
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
  const [cartQuantity, setCartQuantity] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customPrintingLocations, setCustomPrintingLocations] = useState<string[]>([]);
  const [printingSize, setPrintingSize] = useState<string | null>(null);

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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get cart items with product details
      const { data: items, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (
            id,
            title,
            price,
            images,
            delivery_charges,
            free_delivery_above,
            sale_percentage,
            allows_custom_printing,
            custom_printing_options,
            printing_guide
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      if (!items || items.length === 0) {
        navigate('/cart');
        return;
      }

      setCartItems(items);

      // Set the first product for custom printing options
      // Assuming all items in cart are from same product
      if (items[0]?.products) {
        setProduct(items[0].products);
      }

      // Calculate total quantity and subtotal
      const total = items.reduce((sum, item) => {
        const price = item.products?.price || 0;
        const quantity = item.quantity || 0;
        return sum + (price * quantity);
      }, 0);

      setSubtotal(total);
      setCartQuantity(items.reduce((sum, item) => sum + (item.quantity || 0), 0));

      // Calculate delivery charges
      const firstProduct = items[0]?.products;
      if (firstProduct) {
        if (total >= (firstProduct.free_delivery_above || 0)) {
          setDeliveryCharges(0);
        } else {
          setDeliveryCharges(firstProduct.delivery_charges || 0);
        }
      }

    } catch (error) {
      console.error('Error calculating subtotal:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load cart items",
      });
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
    const totalBeforeDiscount = subtotal + customPrintingPrice + deliveryCharges;
    return totalBeforeDiscount - discountAmount;
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
        total_amount: calculateTotal(),
        shipping_address: formData.shippingAddress,
        invoice_data: {
          items: orderItems,
          payment_method: formData.paymentMethod,
          custom_printing: formData.wantsCustomPrinting ? {
            price: customPrintingPrice,
            price_per_item: customPrintingPrice / cartQuantity,
            quantity: cartQuantity,
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

  const updateTotalPrice = (basePrice: number) => {
    // basePrice is the per-item cost, multiply by quantity for total
    const totalPrintingPrice = basePrice * cartQuantity;
    setCustomPrintingPrice(totalPrintingPrice);
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    const discountAmount = (subtotal * appliedCoupon.discount_percentage) / 100;
    return Math.min(discountAmount, appliedCoupon.max_discount_amount);
  };

  const handleApplyCoupon = (coupon: Coupon | null) => {
    setAppliedCoupon(coupon);
    if (coupon) {
      const discount = Math.min(
        (subtotal * coupon.discount_percentage) / 100,
        coupon.max_discount_amount
      );
      setDiscountAmount(discount);
      toast({
        title: "Coupon Applied",
        description: `Saved ₹${discount.toFixed(2)} with coupon ${coupon.code}`,
      });
    } else {
      setDiscountAmount(0);
    }
  };

  const updatePrintingPrice = (locations: string[], size: string | null) => {
    if (!product || !size) return;

    let totalPrice = 0;
    const options = product.custom_printing_options;

    locations.forEach(location => {
      if (size === "small") {
        totalPrice += options.small_locations[location as keyof typeof options.small_locations] || 0;
      } else if (size === "medium") {
        totalPrice += options.medium_locations[location as keyof typeof options.medium_locations] || 0;
      } else if (size === "large") {
        totalPrice += options.large_locations[location as keyof typeof options.large_locations] || 0;
      }
    });

    setCustomPrintingPrice(totalPrice * cartQuantity);
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
                cartQuantity={cartQuantity}
              />

              <CouponSelector
                productIds={cartItems.map(item => item.product_id)}
                subtotal={subtotal}
                onApplyCoupon={handleApplyCoupon}
                appliedCoupon={appliedCoupon}
              />
            </div>

            {/* Order Summary */}
            <div>
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-4">
                  {/* Product Subtotal */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Products Subtotal</span>
                    <span>{formatIndianPrice(subtotal)}</span>
                  </div>

                  {/* Custom Printing Charges - Detailed Breakdown */}
                  {customPrintingPrice > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <div className="flex flex-col">
                          <span className="text-gray-600">Printing Cost (per item)</span>
                          <span className="text-xs text-gray-500">Base printing charge</span>
                        </div>
                        <span className="font-medium">₹{(customPrintingPrice/cartQuantity).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between border-t border-gray-200 pt-2">
                        <div className="flex flex-col">
                          <span className="text-gray-600">Total Printing Cost</span>
                          <span className="text-xs text-gray-500">
                            (₹{(customPrintingPrice/cartQuantity).toFixed(2)} × {cartQuantity} items)
                          </span>
                        </div>
                        <span className="text-cyan-600 font-medium">{formatIndianPrice(customPrintingPrice)}</span>
                      </div>
                    </div>
                  )}

                  {/* Delivery Charges */}
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

                  {/* Subtotal before discount */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal (inc. printing)</span>
                      <span className="font-medium">{formatIndianPrice(subtotal + customPrintingPrice + deliveryCharges)}</span>
                    </div>
                  </div>

                  {/* Discount */}
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount Applied</span>
                      <span>-{formatIndianPrice(discountAmount)}</span>
                    </div>
                  )}

                  {/* Final Total */}
                  <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total Amount</span>
                      <div className="text-right">
                        <span className="text-cyan-600">{formatIndianPrice(calculateTotal())}</span>
                        {customPrintingPrice > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Includes printing charges: {formatIndianPrice(customPrintingPrice)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Place Order Button */}
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
