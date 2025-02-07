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
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { formatIndianPrice } from "@/lib/utils";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    sale_percentage?: number;
    delivery_charges?: number;
    free_delivery_above?: number;
  };
}

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

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
        .select("id, quantity, product:products(*)")
        .eq("user_id", user?.id);

      if (error) throw error;
      setCartItems(data || []);
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

  const updateQuantity = async (itemId: string, delta: number) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;

    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", itemId);

      if (error) throw error;

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update quantity",
      });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item",
      });
    }
  };

  const calculateDeliveryCharges = (items: CartItem[]) => {
    let totalAmount = items.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0);

    // If any item has free delivery above the total amount, no delivery charge for that item
    return items.reduce((total, item) => {
      if (totalAmount >= (item.product.free_delivery_above || 499)) {
        return total;
      }
      return total + (item.product.delivery_charges || 0);
    }, 0);
  };

  const subtotal = cartItems.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0);
  const deliveryCharges = calculateDeliveryCharges(cartItems);
  const total = subtotal + deliveryCharges;

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
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                        />
                        {item.product.sale_percentage && (
                          <div className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                            {item.product.sale_percentage}% OFF
                          </div>
                        )}
                      </div>

                      {/* Enhanced Product Details */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                              {item.product.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Category: {item.product.category}
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
                                {formatIndianPrice(item.product.price * item.quantity)}
                              </span>
                              {item.product.sale_percentage && (
                                <span className="text-sm text-gray-400 line-through">
                                  {formatIndianPrice(
                                    (item.product.price * item.quantity) /
                                      (1 - item.product.sale_percentage / 100)
                                  )}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatIndianPrice(item.product.price)} per item
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Enhanced Order Summary */}
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
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatIndianPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery</span>
                    <span className={deliveryCharges === 0 ? "text-green-600 font-medium" : ""}>
                      {deliveryCharges > 0 
                        ? formatIndianPrice(deliveryCharges)
                        : 'FREE'}
                    </span>
                  </div>
                  
                  {deliveryCharges > 0 && (
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <p className="text-sm text-blue-700 flex items-center gap-2">
                        <Truck className="h-5 w-5 flex-shrink-0" />
                        <span>
                          Add items worth {formatIndianPrice(499 - subtotal)} more for 
                          <span className="font-semibold"> FREE delivery</span>
                        </span>
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-6 mt-6">
                    <div className="flex justify-between items-center mb-8">
                      <span className="text-lg font-medium">Total Amount</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        {formatIndianPrice(total)}
                      </span>
                    </div>

                    <Button
                      className="w-full bg-black hover:bg-black/90 text-lg h-14 rounded-xl"
                      onClick={() => navigate("/checkout")}
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    <div className="mt-6 space-y-3">
                      <p className="text-xs text-gray-500 text-center">
                        Prices are inclusive of all taxes
                      </p>
                      <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Truck className="h-4 w-4" /> Free Delivery
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="h-4 w-4" /> Best Price
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}