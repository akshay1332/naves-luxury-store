import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingCart,
  Tag,
  Truck,
  Percent,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { formatIndianPrice } from "@/lib/utils";
import { CouponSelector } from "@/components/checkout/CouponSelector";

interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  products: {
    id: string;
    title: string;
    price: number;
    images: string[];
    delivery_charges: number;
    free_delivery_above: number;
    sale_percentage?: number;
    category: string;
  };
}

interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_percentage: number;
  min_purchase_amount: number;
  max_discount_amount: number;
}

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          id,
          quantity,
          product_id,
          products (
            id,
            title,
            price,
            images,
            delivery_charges,
            free_delivery_above,
            sale_percentage,
            category
          )
        `)
        .eq("user_id", user?.id);

      if (error) throw error;
      setCartItems(data || []);
      calculateTotals(data || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load cart items",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (items: CartItem[]) => {
    // Calculate subtotal with sale prices
    const total = items.reduce((sum, item) => {
      const basePrice = item.products.price;
      const salePercentage = item.products.sale_percentage || 0;
      const finalPrice = basePrice * (1 - salePercentage / 100);
      return sum + (finalPrice * item.quantity);
    }, 0);
    setSubtotal(total);

    // Calculate delivery charges
    let maxDeliveryCharge = 0;
    let maxFreeDeliveryThreshold = 0;

    items.forEach(item => {
      maxDeliveryCharge = Math.max(maxDeliveryCharge, item.products.delivery_charges);
      maxFreeDeliveryThreshold = Math.max(maxFreeDeliveryThreshold, item.products.free_delivery_above);
    });

    // If subtotal is above the highest free delivery threshold, delivery is free
    setDeliveryCharges(total >= maxFreeDeliveryThreshold ? 0 : maxDeliveryCharge);

    // Recalculate coupon discount if a coupon is applied
    if (appliedCoupon) {
      const newDiscount = Math.min(
        (total * appliedCoupon.discount_percentage) / 100,
        appliedCoupon.max_discount_amount
      );
      setDiscountAmount(newDiscount);
    }
  };

  const updateQuantity = async (itemId: string, delta: number) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;

    // Optimistically update UI
    const updatedItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    calculateTotals(updatedItems);

    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", itemId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      // Revert changes on error
      setCartItems((prev) => prev.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity - delta } : item
      ));
      calculateTotals(cartItems);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update quantity",
      });
    }
  };

  const removeItem = async (itemId: string) => {
    // Optimistically remove item
    const removedItem = cartItems.find(item => item.id === itemId);
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    calculateTotals(updatedItems);

    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    } catch (error) {
      console.error("Error removing item:", error);
      // Revert changes on error
      if (removedItem) {
        setCartItems(prev => [...prev, removedItem]);
        calculateTotals([...updatedItems, removedItem]);
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item",
      });
    }
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

  const calculateTotal = () => {
    return subtotal + deliveryCharges - discountAmount;
  };

  const calculateItemTotal = (item: CartItem) => {
    const basePrice = item.products.price;
    const quantity = item.quantity;
    const salePercentage = item.products.sale_percentage || 0;
    const discountedPrice = basePrice * (1 - salePercentage / 100);
    return discountedPrice * quantity;
  };

  const OrderSummary = ({ 
    cartItems, 
    subtotal, 
    deliveryCharges, 
    appliedCoupon, 
    discountAmount 
  }: { 
    cartItems: CartItem[];
    subtotal: number;
    deliveryCharges: number;
    appliedCoupon: Coupon | null;
    discountAmount: number;
  }) => {
    const navigate = useNavigate();

    // Find the highest free delivery threshold from all products
    const maxFreeDeliveryThreshold = Math.max(
      ...cartItems.map(item => item.products.free_delivery_above)
    );

    // Calculate amount needed for free delivery
    const amountForFreeDelivery = maxFreeDeliveryThreshold - subtotal;

    // Calculate total savings
    const calculateTotalSavings = () => {
      let savings = 0;
      
      // Savings from sale prices
      cartItems.forEach(item => {
        if (item.products.sale_percentage) {
          const originalPrice = item.products.price;
          const salePrice = originalPrice * (1 - item.products.sale_percentage / 100);
          savings += (originalPrice - salePrice) * item.quantity;
        }
      });

      // Savings from coupon
      if (appliedCoupon) {
        savings += discountAmount;
      }

      // Savings from free delivery
      if (deliveryCharges === 0 && subtotal >= maxFreeDeliveryThreshold) {
        savings += Math.max(...cartItems.map(item => item.products.delivery_charges));
      }

      return savings;
    };

    const totalSavings = calculateTotalSavings();
    const finalTotal = subtotal + deliveryCharges - discountAmount;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-1"
      >
        <Card className="p-8 sticky top-4 bg-white/90 backdrop-blur-md rounded-2xl border-0 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Order Summary
          </h2>

          <div className="space-y-6">
            {/* Price Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  Price ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
                </span>
                <span className="font-medium">{formatIndianPrice(subtotal)}</span>
              </div>

              {/* Show sale discounts if any */}
              {cartItems.some(item => item.products.sale_percentage) && (
                <div className="flex justify-between text-green-600 text-sm">
                  <span>Sale Discount</span>
                  <span>
                    -{formatIndianPrice(cartItems.reduce((sum, item) => {
                      if (item.products.sale_percentage) {
                        const originalPrice = item.products.price * item.quantity;
                        const salePrice = originalPrice * (1 - item.products.sale_percentage / 100);
                        return sum + (originalPrice - salePrice);
                      }
                      return sum;
                    }, 0))}
                  </span>
                </div>
              )}

              {/* Coupon Discount */}
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Coupon: {appliedCoupon.code}
                  </span>
                  <span>-{formatIndianPrice(discountAmount)}</span>
                </div>
              )}

              {/* Delivery Charges */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Delivery</span>
                <span className={deliveryCharges === 0 ? "text-green-600 font-medium" : ""}>
                  {deliveryCharges > 0 
                    ? formatIndianPrice(deliveryCharges)
                    : (
                      <span className="flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        FREE
                      </span>
                    )}
                </span>
              </div>
            </div>

            {/* Free Delivery Progress */}
            {deliveryCharges > 0 && amountForFreeDelivery > 0 && (
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-blue-700 flex items-center gap-2">
                  <Truck className="h-5 w-5 flex-shrink-0" />
                  <span>
                    Add items worth {formatIndianPrice(amountForFreeDelivery)} more for 
                    <span className="font-semibold"> FREE delivery</span>
                  </span>
                </p>
                {/* Progress bar */}
                <div className="mt-2 h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, (subtotal / maxFreeDeliveryThreshold) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            )}

            {/* Total Savings */}
            {totalSavings > 0 && (
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <span className="font-semibold">Total Savings:</span>
                  {formatIndianPrice(totalSavings)}
                </p>
              </div>
            )}

            {/* Final Total */}
            <div className="border-t pt-6 mt-6">
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-medium">Total Amount</span>
                <div className="text-right">
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {formatIndianPrice(finalTotal)}
                  </span>
                  {totalSavings > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      You save {formatIndianPrice(totalSavings)}
                    </p>
                  )}
                </div>
              </div>

              <Button
                className="w-full bg-black hover:bg-black/90 text-lg h-14 rounded-xl"
                onClick={() => navigate("/checkout")}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              {/* Additional Information */}
              <div className="mt-6 space-y-3">
                <p className="text-xs text-gray-500 text-center">
                  Prices are inclusive of all taxes
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  {deliveryCharges === 0 && (
                    <span className="flex items-center gap-1">
                      <Truck className="h-4 w-4" /> Free Delivery
                    </span>
                  )}
                  {appliedCoupon && (
                    <span className="flex items-center gap-1">
                      <Tag className="h-4 w-4" /> Coupon Applied
                    </span>
                  )}
                  {cartItems.some(item => item.products.sale_percentage) && (
                    <span className="flex items-center gap-1">
                      <Percent className="h-4 w-4" /> Sale Price
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  // Add useEffect to recalculate totals when cart items change
  useEffect(() => {
    if (cartItems.length > 0) {
      calculateTotals(cartItems);
    } else {
      setSubtotal(0);
      setDeliveryCharges(0);
      setDiscountAmount(0);
      setAppliedCoupon(null);
    }
  }, [cartItems]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <ShoppingBag className="w-16 h-16 text-primary" />
          <motion.div
            className="absolute inset-0 border-4 border-primary/30 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-transparent mb-3">
            Your Shopping Bag
          </h1>
          <p className="text-gray-600 text-lg">
            {cartItems.length === 0 
              ? "Ready to start shopping?"
              : `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'} selected for checkout`
            }
          </p>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center py-16 px-8 bg-white rounded-3xl shadow-sm"
          >
            <motion.div
              initial={{ scale: 0.5, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="mb-8"
            >
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Your bag is empty
            </h2>
            <p className="text-gray-500 mb-8 text-lg">
              Discover our latest collection and find your perfect style.
              We've got something special waiting for you!
            </p>
            <Link to="/products">
              <Button 
                size="lg" 
                className="bg-black hover:bg-black/90 text-lg px-8 py-6 rounded-full"
              >
                Explore Collection
              </Button>
            </Link>
            
            {/* Shopping Benefits */}
            <div className="grid grid-cols-2 gap-4 mt-12 text-left">
              <div className="p-4 rounded-xl bg-gray-50">
                <Truck className="w-6 h-6 text-primary mb-2" />
                <h3 className="font-medium mb-1">Free Shipping</h3>
                <p className="text-sm text-gray-500">On orders above ₹499</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50">
                <Tag className="w-6 h-6 text-primary mb-2" />
                <h3 className="font-medium mb-1">Best Prices</h3>
                <p className="text-sm text-gray-500">Quality guaranteed</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-6 flex gap-6">
                      {/* Product Image with Hover Effect */}
                      <div className="relative aspect-square w-40 rounded-xl overflow-hidden bg-gray-50">
                        <img
                          src={item.products.images[0]}
                          alt={item.products.title}
                          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                        />
                        {item.products.sale_percentage && (
                          <div className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                            {item.products.sale_percentage}% OFF
                          </div>
                        )}
                      </div>

                      {/* Enhanced Product Details */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                              {item.products.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Category: {item.products.category}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-300"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>

                        <div className="mt-auto flex items-end justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-white"
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-white"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Price Display */}
                          <div className="text-right">
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                {formatIndianPrice(item.products.price * item.quantity)}
                              </span>
                              {item.products.sale_percentage && (
                                <span className="text-sm text-gray-400 line-through">
                                  {formatIndianPrice(
                                    (item.products.price * item.quantity) /
                                      (1 - item.products.sale_percentage / 100)
                                  )}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatIndianPrice(item.products.price)} per item
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Coupon Selector */}
              <CouponSelector
                productIds={cartItems.map(item => item.product_id)}
                subtotal={subtotal}
                onApplyCoupon={handleApplyCoupon}
                appliedCoupon={appliedCoupon}
              />
            </div>

            {/* Enhanced Order Summary */}
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              deliveryCharges={deliveryCharges}
              appliedCoupon={appliedCoupon}
              discountAmount={discountAmount}
            />
          </div>
        )}
      </div>
    </div>
  );
}