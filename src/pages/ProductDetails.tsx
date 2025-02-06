import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { LuxuryLoader } from "@/components/LuxuryLoader";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import ReviewForm from "@/components/product/ReviewForm";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, Truck, ArrowRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Json } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice, formatIndianPrice } from "@/lib/utils";
import { SEO } from "@/components/SEO";
import { format, addDays } from "date-fns";
import { Link } from "react-router-dom";

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
  key_highlights?: {
    material?: string;
    capacity?: string;
    lidType?: string;
    insulation?: string;
    pattern?: string;
    finish?: string;
    fit?: string;
    fabric?: string;
    neck?: string;
    sleeve?: string;
    length?: string;
  };
}

// Add this new component for pricing display
const PriceDisplay = ({ price, salePrice, salePercentage }: { 
  price: number, 
  salePrice?: number, 
  salePercentage?: number 
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-3">
        {/* Main Price */}
        <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          {formatIndianPrice(salePrice || price)}
        </span>
        
        {/* Original Price & Discount */}
        {salePrice && (
          <>
            <span className="text-lg text-gray-400 line-through">
              {formatIndianPrice(price)}
            </span>
            <span className="text-sm font-medium px-2 py-1 rounded-full bg-red-50 text-red-500">
              {salePercentage}% OFF
            </span>
          </>
        )}
      </div>
      <p className="text-sm text-gray-500">
        MRP incl. of all taxes
      </p>
    </div>
  );
};

// Update the getStatusColor function
const getStatusColor = (status: string) => {
  const colors = {
    pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    processing: "bg-blue-50 text-blue-700 border border-blue-200",
    shipped: "bg-purple-50 text-purple-700 border border-purple-200",
    delivered: "bg-green-50 text-green-700 border border-green-200",
    cancelled: "bg-red-50 text-red-700 border border-red-200",
    refunded: "bg-gray-50 text-gray-700 border border-gray-200",
  };
  return colors[status as keyof typeof colors] || "bg-gray-50 text-gray-700 border border-gray-200";
};

// Update the key highlights section to be dynamic
const KeyHighlights = ({ product }: { product: Product }) => {
  const isCupOrBottle = product.category?.toLowerCase().includes('cup') || 
                       product.category?.toLowerCase().includes('bottle');

  if (isCupOrBottle) {
    return (
      <div className="grid grid-cols-2 gap-6">
        {product.key_highlights?.material && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Material</h4>
            <p className="text-sm text-gray-900">{product.key_highlights.material}</p>
          </div>
        )}
        {product.key_highlights?.capacity && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Capacity</h4>
            <p className="text-sm text-gray-900">{product.key_highlights.capacity}</p>
          </div>
        )}
        {product.key_highlights?.lidType && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Lid Type</h4>
            <p className="text-sm text-gray-900">{product.key_highlights.lidType}</p>
          </div>
        )}
        {product.key_highlights?.insulation && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Insulation</h4>
            <p className="text-sm text-gray-900">{product.key_highlights.insulation}</p>
          </div>
        )}
        {product.key_highlights?.pattern && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Pattern</h4>
            <p className="text-sm text-gray-900">{product.key_highlights.pattern}</p>
          </div>
        )}
        {product.key_highlights?.finish && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Finish</h4>
            <p className="text-sm text-gray-900">{product.key_highlights.finish}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {product.key_highlights?.fit && (
        <div>
          <h4 className="text-sm font-medium text-gray-500">Fit</h4>
          <p className="text-sm text-gray-900">{product.key_highlights.fit}</p>
        </div>
      )}
      {product.key_highlights?.fabric && (
        <div>
          <h4 className="text-sm font-medium text-gray-500">Fabric</h4>
          <p className="text-sm text-gray-900">{product.key_highlights.fabric}</p>
        </div>
      )}
      {product.key_highlights?.neck && (
        <div>
          <h4 className="text-sm font-medium text-gray-500">Neck</h4>
          <p className="text-sm text-gray-900">{product.key_highlights.neck}</p>
        </div>
      )}
      {product.key_highlights?.sleeve && (
        <div>
          <h4 className="text-sm font-medium text-gray-500">Sleeve</h4>
          <p className="text-sm text-gray-900">{product.key_highlights.sleeve}</p>
        </div>
      )}
      {product.key_highlights?.pattern && (
        <div>
          <h4 className="text-sm font-medium text-gray-500">Pattern</h4>
          <p className="text-sm text-gray-900">{product.key_highlights.pattern}</p>
        </div>
      )}
      {product.key_highlights?.length && (
        <div>
          <h4 className="text-sm font-medium text-gray-500">Length</h4>
          <p className="text-sm text-gray-900">{product.key_highlights.length}</p>
        </div>
      )}
    </div>
  );
};

// Add this new component for a better product status badge
const ProductStatusBadge = ({ type }: { type: string }) => {
  const getStatusStyles = () => {
    switch (type) {
      case 'NEW':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'SALE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'TRENDING':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'BESTSELLER':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyles()}`}>
      {type}
    </span>
  );
};

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
          key_highlights,
          colors,
          sizes,
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

  // Calculate delivery date range
  const startDate = addDays(new Date(), 3); // Delivery starts 3 days from now
  const endDate = addDays(new Date(), 7);   // Delivery ends 7 days from now (5 day window)

  // Format dates
  const formattedStartDate = format(startDate, "MMM dd");
  const formattedEndDate = format(endDate, "MMM dd");

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleImageNavigation('prev');
      } else if (e.key === 'ArrowRight') {
        handleImageNavigation('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product?.images]);

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
    <>
      <SEO 
        title={`${product.title} - Custom Print | Premium Custom Clothing`}
        description={`${product.description || `Get this premium ${product.category} with custom designs. High-quality material, perfect fit, and professional printing. Available in ${product.colors?.join(', ')} colors and sizes ${product.sizes?.join(', ')}.`}`}
        keywords={[
          product.title.toLowerCase(),
          `custom ${product.category?.toLowerCase()}`,
          `printed ${product.category?.toLowerCase()}`,
          'custom clothing india',
          'premium clothing printing',
          'personalized apparel',
          'custom design printing',
          'quality print service',
          ...(product.colors?.map(color => `${color} ${product.category}`) || []),
          ...(product.sizes?.map(size => `size ${size} ${product.category}`) || [])
        ]}
        image={product.images?.[0]}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb with animation */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-2 text-sm text-gray-600 mb-8"
          >
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </motion.div>

          {/* Main Product Section */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Image Gallery with enhanced animations */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-white p-2 border shadow-sm">
                <motion.img
                  key={selectedImageIndex}
                  src={product.images?.[selectedImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover object-center rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Previous/Next Buttons */}
                {product.images && product.images.length > 1 && (
                  <>
                    {/* Previous Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleImageNavigation('prev')}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </motion.button>

                    {/* Next Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleImageNavigation('next')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </motion.button>
                  </>
                )}
                
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm">
                  {selectedImageIndex + 1} / {product.images?.length || 0}
                </div>

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.is_new_arrival && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
                      NEW
                    </span>
                  )}
                  {product.sale_percentage && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-500 text-white">
                      {product.sale_percentage}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Grid */}
              <div className="grid grid-cols-4 gap-4">
                {product.images?.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                      index === selectedImageIndex 
                        ? 'border-black' 
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Product Info with enhanced styling */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-6"
            >
              {/* Product Status Badges */}
              <div className="flex flex-wrap gap-2">
                {product.is_new_arrival && <ProductStatusBadge type="NEW" />}
                {product.sale_percentage && <ProductStatusBadge type="SALE" />}
                {product.is_trending && <ProductStatusBadge type="TRENDING" />}
                {product.is_best_seller && <ProductStatusBadge type="BESTSELLER" />}
              </div>

              {/* Title and Price */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
                <PriceDisplay 
                  price={product.price}
                  salePrice={product.sale_percentage ? Math.round(product.price * (1 - product.sale_percentage / 100)) : undefined}
                  salePercentage={product.sale_percentage}
                />
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 gap-4 my-8">
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <Truck className="w-5 h-5" />
                    <span className="font-medium">Free Delivery</span>
                  </div>
                  <p className="text-sm text-gray-600">On orders above ₹499</p>
                </div>
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <ArrowRight className="w-5 h-5" />
                    <span className="font-medium">Easy Returns</span>
                  </div>
                  <p className="text-sm text-gray-600">7 days return policy</p>
                </div>
              </div>

              {/* Colors Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Color
                  </label>
                  <div className="flex gap-3">
                    {product.colors.map(color => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "w-12 h-12 rounded-full transition-all",
                          "border-2",
                          selectedColor === color
                            ? "ring-2 ring-black ring-offset-2"
                            : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-2"
                        )}
                        style={{
                          backgroundColor: color.toLowerCase(),
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Size
                    </label>
                    <button className="text-sm text-primary-600 hover:text-primary-500">
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {product.sizes.map(size => (
                      <motion.button
                        key={size}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "py-3 rounded-lg font-medium transition-all",
                          selectedSize === size
                            ? "bg-black text-white"
                            : "bg-white border-2 border-gray-200 hover:border-black"
                        )}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Section */}
              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= (product.stock_quantity || 1)}
                      className="p-3 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.stock_quantity} items available
                  </span>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-black hover:bg-black/90"
                    size="lg"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => setIsWishlist(!isWishlist)}
                    variant="outline"
                    size="lg"
                    className={cn(
                      "flex-1",
                      isWishlist && "bg-red-50 border-red-200 text-red-600"
                    )}
                  >
                    <Heart
                      className={cn(
                        "w-5 h-5 mr-2",
                        isWishlist && "fill-red-600"
                      )}
                    />
                    Wishlist
                  </Button>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="pt-8">
                <h3 className="text-lg font-medium mb-4">Key Highlights</h3>
                <KeyHighlights product={product} />
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
      </div>
    </>
  );
};

export default ProductDetails;