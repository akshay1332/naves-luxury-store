import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ShoppingBag, CreditCard, Truck, Upload, Link as LinkIcon, AlertCircle, Loader2 } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";

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
}

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image under 2MB",
      });
      return;
    }

    // Check file type
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
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          },
        });

      if (error) throw error;

      // Get public URL
      const { data: publicURL } = supabase.storage
        .from("custom-designs")
        .getPublicUrl(fileName);

      return publicURL.publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let customDesignUrl = formData.customDesignLink || "";

      // If there's a file to upload
      if (formData.wantCustomDesign && formData.customDesignType === "upload" && formData.customDesignFile) {
        customDesignUrl = await uploadCustomDesign(formData.customDesignFile);
      }

      const total = subtotal - discountAmount;

      // Generate invoice number (you might want to adjust this format)
      const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          status: 'pending',
          total_amount: total,
          shipping_address: {
            ...formData.shippingAddress,
            country: 'US' // Add default country or make it configurable
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          invoice_number: invoiceNumber,
          invoice_data: {
            items: [],
            payment_method: formData.paymentMethod,
            custom_design: formData.wantCustomDesign
              ? {
                  type: formData.customDesignType,
                  url: customDesignUrl,
                  instructions: formData.specialInstructions
                }
              : null
          },
          discount_amount: discountAmount,
          updated_by: user?.id,
          tracking_number: null // Will be added when shipping is processed
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Update coupon usage if one was applied
      if (appliedCouponId) {
        const { error: couponError } = await supabase
          .rpc('increment_coupon_usage', {
            coupon_id: appliedCouponId
          });

        if (couponError) throw couponError;
      }

      // Clear cart
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user?.id);

      toast({
        title: "Success",
        description: "Order placed successfully!",
      });

      navigate('/profile');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred while placing your order";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
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
              />
            </div>

            {/* Order Summary */}
            <div>
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping</span>
                    {subtotal > 499 ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <Truck className="h-4 w-4" />
                        <span>Free</span>
                      </div>
                    ) : (
                      <span>₹49</span>
                    )}
                  </div>
                  {subtotal <= 499 && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Free shipping on orders above ₹499
                    </p>
                  )}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total</span>
                      <span className="text-cyan-600">
                        ₹{(subtotal - discountAmount + (subtotal > 499 ? 0 : 49)).toLocaleString('en-IN')}
                      </span>
                    </div>
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