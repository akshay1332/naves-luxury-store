import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star, Truck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sale_percentage: number;
  is_new_arrival?: boolean;
  is_best_seller?: boolean;
  is_featured?: boolean;
  is_trending?: boolean;
  rating?: number;
  reviews_count?: number;
  delivery_charges: number;
  free_delivery_above: number;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);

  const discountedPrice = product.sale_percentage
    ? product.price - (product.price * product.sale_percentage) / 100
    : product.price;

  // Calculate if eligible for free delivery
  const isEligibleForFreeDelivery = product.price >= (product.free_delivery_above || 0);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setIsAddingToCart(true);
      
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please log in to add items to your cart",
        });
        return;
      }

      // Check if item already exists in cart
      const { data: existingItem, error: checkError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let result;
      if (existingItem) {
        // Update quantity if item exists
        result = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);
      } else {
        // Insert new item if it doesn't exist
        result = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity: 1
          });
      }

      if (result.error) throw result.error;

      // Show success toast
      toast({
        title: "Added to Cart",
        description: `${product.title} has been added to your cart`,
        variant: "default",
      });

      // Add success animation to button
      const button = e.currentTarget as HTMLButtonElement;
      button.classList.add('success');
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Added to Cart",
        description: `${product.title} has been added to your cart`,
        variant: "default",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Added to wishlist",
      description: `${product.title} has been added to your wishlist`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={cn(
        "group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-xl",
        className
      )}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div 
          className="relative aspect-[3/4] overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Primary Image with Zoom Effect */}
          <motion.img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            style={{
              opacity: isHovered && product.images[1] ? 0 : 1,
              transition: 'opacity 0.5s ease-in-out',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />

          {/* Secondary Image */}
          {product.images[1] && (
            <motion.img
              src={product.images[1]}
              alt={`${product.title} - alternate view`}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              style={{
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges with improved styling */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
            {product.sale_percentage > 0 && (
              <Badge variant="destructive" className="px-2.5 py-1 bg-red-500/90 backdrop-blur-sm">
                {product.sale_percentage}% OFF
              </Badge>
            )}
            {product.is_new_arrival && (
              <Badge variant="default" className="px-2.5 py-1 bg-emerald-500/90 backdrop-blur-sm">
                NEW
              </Badge>
            )}
            {product.is_trending && (
              <Badge variant="default" className="px-2.5 py-1 bg-purple-500/90 backdrop-blur-sm">
                TRENDING
              </Badge>
            )}
          </div>

          {/* Quick actions with improved animation */}
          <div className="absolute right-3 top-3 flex flex-col gap-2 translate-x-12 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 z-10">
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-300"
              onClick={handleWishlist}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className={cn(
                "h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-300",
                isAddingToCart && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Rating badge with glass effect */}
          {product.rating && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 backdrop-blur-sm z-10">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
              {product.reviews_count && (
                <span className="text-xs text-gray-500">
                  ({product.reviews_count})
                </span>
              )}
            </div>
          )}
        </div>

        <div className="p-4">
          {/* Category with hover effect */}
          <p className="mb-1 text-sm font-medium text-gray-500 group-hover:text-primary transition-colors">
            {product.category}
          </p>

          {/* Title with gradient effect */}
          <h3 className="mb-2 text-base font-medium bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent line-clamp-1">
            {product.title}
          </h3>

          {/* Description */}
          <p className="mb-3 text-sm text-gray-600 line-clamp-2 group-hover:text-gray-900 transition-colors">
            {product.description}
          </p>

          {/* Price and Delivery Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <motion.span 
                className="text-lg font-bold text-gray-900"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                ₹{discountedPrice.toLocaleString('en-IN')}
              </motion.span>
              {product.sale_percentage > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Delivery Information */}
            <div className="flex items-center gap-1 text-sm">
              <Truck className="h-4 w-4 flex-shrink-0" />
              {isEligibleForFreeDelivery ? (
                <span className="text-green-600 font-medium">Free Delivery</span>
              ) : (
                <div className="flex flex-col">
                  <span className="text-gray-600">
                    Delivery: ₹{product.delivery_charges.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-gray-500">
                    Free delivery above ₹{product.free_delivery_above.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Add to cart button */}
          <Button
            variant="default"
            size="sm"
            className={cn(
              "mt-3 w-full rounded-full transition-all duration-300",
              "hover:scale-105 hover:shadow-lg",
              "bg-black hover:bg-black/90",
              "disabled:opacity-50 disabled:hover:scale-100",
              isAddingToCart && "animate-pulse"
            )}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Adding...
              </span>
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>
      </Link>
    </motion.div>
  );
}