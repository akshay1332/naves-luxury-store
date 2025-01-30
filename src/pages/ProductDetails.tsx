import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LuxuryLoader } from "@/components/LuxuryLoader";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import ReviewForm from "@/components/product/ReviewForm";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Json } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

type QuickViewData = {
  material?: string;
  fit?: string;
  care_instructions?: string[];
  features?: string[];
}

// Type guard to check if a value is a QuickViewData object
function isQuickViewData(value: Json): value is { [K in keyof QuickViewData]: Json } {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  
  const v = value as Record<string, unknown>;
  return (
    (v.material === undefined || typeof v.material === 'string') &&
    (v.fit === undefined || typeof v.fit === 'string') &&
    (v.care_instructions === undefined || (Array.isArray(v.care_instructions) && v.care_instructions.every(i => typeof i === 'string'))) &&
    (v.features === undefined || (Array.isArray(v.features) && v.features.every(f => typeof f === 'string')))
  );
}

interface Product {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  gender: string | null;
  colors: string[] | null;
  sizes: string[] | null;
  price: number;
  images: string[] | null;
  video_url: string | null;
  is_featured: boolean | null;
  is_best_seller: boolean | null;
  is_new_arrival: boolean | null;
  is_trending: boolean | null;
  stock_quantity: number | null;
  created_at: string;
  updated_at: string;
  quick_view_data: Json | null;
  sale_percentage: number | null;
  sale_start_date: string | null;
  sale_end_date: string | null;
  style_category: string | null;
  coupons?: {
    id: string;
    code: string;
    discount_percentage: number;
    valid_until: string;
    is_active: boolean;
    min_purchase_amount: number;
  }[];
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);
  const { toast } = useToast();

  // Add new state for cart count
  const [cartCount, setCartCount] = useState(0);

  // Add hover state for images
  const [isHovered, setIsHovered] = useState(false);

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          coupons (
            id,
            code,
            discount_percentage,
            valid_until,
            is_active,
            min_purchase_amount
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleAddToCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please log in to add items to your cart",
        });
        return;
      }

      if (!selectedSize && product?.sizes?.length > 0) {
        toast({
          variant: "destructive",
          title: "Size required",
          description: "Please select a size",
        });
        return;
      }

      if (!selectedColor && product?.colors?.length > 0) {
        toast({
          variant: "destructive",
          title: "Color required",
          description: "Please select a color",
        });
        return;
      }

      if (product.stock_quantity < quantity) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Not enough stock available",
        });
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: id,
          quantity,
          size: selectedSize || null,
          color: selectedColor || null,
        });

      if (error) throw error;

      setCartCount(prev => prev + quantity);
      toast({
        title: "Success",
        description: "Item added to cart",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock_quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (!product?.images?.length) return;
    
    setSelectedImageIndex(prev => {
      if (direction === 'next') {
        return (prev + 1) % product.images.length;
      } else {
        return prev === 0 ? product.images.length - 1 : prev - 1;
      }
    });
  };

  const activeCoupons = product?.coupons?.filter(
    coupon => coupon.is_active && new Date(coupon.valid_until) > new Date()
  ) || [];

  if (productLoading) {
    return <LuxuryLoader />;
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-2 text-sm text-gray-600 mb-8"
        >
          <button
            onClick={() => navigate('/products')}
            className="hover:text-primary transition-colors"
          >
            Products
          </button>
          <span>/</span>
          <span className="text-gray-900">{product.title}</span>
        </motion.div>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-gray-100 relative group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={product.images?.[selectedImageIndex] || '/placeholder-product.jpg'}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </AnimatePresence>

              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white rounded-full p-2 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_new_arrival && (
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    NEW
                  </span>
                )}
                {product.sale_percentage > 0 && (
                  <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    SAVE {product.sale_percentage}%
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {product.images && product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {product.images.map((image, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`aspect-square rounded-lg overflow-hidden ${
                      selectedImageIndex === i ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} - ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col"
          >
            {/* Tags */}
            <div className="mb-4">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                OVERSIZED
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
            
            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-2xl font-bold text-red-500">₹{product.price.toLocaleString('en-IN')}</span>
              {product.sale_percentage > 0 && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{Math.round(product.price / (1 - product.sale_percentage / 100)).toLocaleString('en-IN')}
                  </span>
                  <span className="text-red-500 font-semibold">
                    ({product.sale_percentage}% OFF)
                  </span>
                </>
              )}
            </div>

            {/* MRP Note */}
            <p className="text-sm text-gray-500 mb-8">MRP incl. of all taxes</p>

            {/* Offers */}
            <div className="bg-orange-50 rounded-lg p-4 mb-8">
              <div className="flex items-start gap-4">
                <span className="text-orange-500 font-semibold">₹</span>
                <div>
                  <p className="font-medium">Get it for as low as ₹999</p>
                  <p className="text-sm text-gray-600">Pick Any 2 Oversized Hoodies ₹1999 | Weekend Only Offer</p>
                  <p className="text-sm text-orange-500 mt-2">Extra ₹100 OFF for Prepaid orders</p>
                  <p className="text-sm mt-2">
                    <span className="font-medium">Code:</span> Code Applies Automatically
                  </p>
                </div>
              </div>
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-gray-900">Color</h3>
                  <span className="text-sm text-gray-500">{selectedColor || 'Select Color'}</span>
                </div>
                <div className="flex gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-12 h-12 rounded-full border-2 transition-all hover:scale-110",
                        selectedColor === color
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-gray-200"
                      )}
                      style={{
                        backgroundColor: color.toLowerCase(),
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Chart Link */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-900">Select Size</h3>
              <button className="text-sm text-primary font-medium hover:underline">
                Size Chart
              </button>
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "h-12 rounded border-2 flex items-center justify-center text-sm font-medium transition-all hover:border-gray-900",
                        selectedSize === size
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 text-gray-900"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded border-2 border-gray-200 flex items-center justify-center text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-900 transition-colors"
                >
                  -
                </button>
                <span className="text-lg font-medium text-gray-900">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (product.stock_quantity || 1)}
                  className="w-10 h-10 rounded border-2 border-gray-200 flex items-center justify-center text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-900 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white"
              >
                ADD TO CART
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsWishlist(!isWishlist)}
                className={cn(
                  "w-full",
                  isWishlist && "text-red-500 border-red-500 hover:bg-red-50"
                )}
              >
                <Heart
                  size={20}
                  className={cn("mr-2 transition-colors", isWishlist && "fill-current")}
                />
                WISHLIST
              </Button>
            </div>

            {/* Delivery Info */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                <div>
                  <p className="font-medium">Estimated Delivery</p>
                  <p className="text-sm text-gray-500">Jan 31 - Feb 04</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div>
                  <p className="font-medium">Free Shipping & Returns</p>
                  <p className="text-sm text-gray-500">On all orders over ₹499, 7 day Easy Returns</p>
                </div>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Key Highlights</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Fit</h4>
                  <p className="text-sm text-gray-900">Oversized Fit</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Fabric</h4>
                  <p className="text-sm text-gray-900">300 GSM Cotton</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Neck</h4>
                  <p className="text-sm text-gray-900">Hooded Round Neck</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Sleeve</h4>
                  <p className="text-sm text-gray-900">Regular Sleeve</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Pattern</h4>
                  <p className="text-sm text-gray-900">Printed</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Length</h4>
                  <p className="text-sm text-gray-900">Regular</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
          className="mt-16 bg-white rounded-2xl p-8 shadow-sm"
      >
        <div className="grid lg:grid-cols-2 gap-12">
          <ProductReviews
            reviews={[]}
            onReviewsUpdate={() => {}}
          />
          <ReviewForm productId={id!} onSuccess={() => {}} />
        </div>
      </motion.div>

        {/* Related Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16"
      >
        <RelatedProducts currentProductId={id!} category={product.category} />
      </motion.div>

      {activeCoupons.length > 0 && (
        <Card className="p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">Available Coupons</h3>
          <div className="space-y-4">
            {activeCoupons.map((coupon) => (
              <div 
                key={coupon.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-lg font-mono">
                      {coupon.code}
                    </Badge>
                    <Badge variant="secondary">
                      {coupon.discount_percentage}% OFF
                    </Badge>
                  </div>
                  {coupon.min_purchase_amount > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Min. purchase: {formatPrice(coupon.min_purchase_amount)}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Valid until: {new Date(coupon.valid_until).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => {
                    navigator.clipboard.writeText(coupon.code);
                    toast({
                      title: "Coupon code copied!",
                      description: "Paste it at checkout to get the discount.",
                    });
                  }}
                >
                  Copy Code
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
      </div>
    </motion.div>
  );
};

export default ProductDetails;