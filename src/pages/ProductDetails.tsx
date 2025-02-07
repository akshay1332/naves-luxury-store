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
  free_delivery_above?: number;
  delivery_charges?: number;
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

  // Add new state for cart operation
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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

      setIsAddingToCart(true);

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
        title: "Added to Cart",
        description: `${product.title} has been added to your cart`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsAddingToCart(false);
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

  // Add this new function to handle category click
  const handleCategoryClick = (category: string | null) => {
    if (category) {
      // Normalize the category before navigation
      const normalizedCategory = category.trim();
      navigate(`/products?category=${encodeURIComponent(normalizedCategory)}`);
    }
  };

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
        title={`${product.title} | CustomPrint`}
        description={product.description || ''}
      />
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {productLoading ? (
            <LuxuryLoader />
          ) : (
            <div className="space-y-8">
              {/* Breadcrumb Navigation */}
              <nav className="flex items-center space-x-2 text-sm text-gray-500">
                <Link to="/products" className="hover:text-rose-500">Products</Link>
                <span>/</span>
                {product?.category && (
                  <>
                    <button
                      onClick={() => handleCategoryClick(product.category)}
                      className="hover:text-rose-500 cursor-pointer capitalize"
                    >
                      {product.category}
                    </button>
                    <span>/</span>
                  </>
                )}
                <span className="text-gray-900">{product?.title}</span>
              </nav>

              {/* Product Main Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {/* Main Image */}
                  <div className="relative aspect-square overflow-hidden rounded-2xl">
                    <img
                      src={product.images?.[selectedImageIndex]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Thumbnail Gallery */}
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {product.images?.map((image, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedImageIndex(index)}
                        className={cn(
                          "relative aspect-square rounded-lg overflow-hidden",
                          selectedImageIndex === index 
                            ? "ring-2 ring-rose-500"
                            : "ring-transparent hover:ring-gray-300"
                        )}
                      >
                        <img
                          src={image}
                          alt={`${product.title} - View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Product Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Title and Price */}
                  <div className="space-y-4">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                      {product?.title}
                    </h1>
                    
                    {/* Add category badge */}
                    {product?.category && (
                      <button
                        onClick={() => handleCategoryClick(product.category)}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-rose-100 hover:text-rose-800 transition-colors duration-200"
                      >
                        {product.category}
                      </button>
                    )}

                    <PriceDisplay
                      price={product.price}
                      salePrice={product.sale_percentage ? Math.round(product.price * (1 - product.sale_percentage / 100)) : undefined}
                      salePercentage={product.sale_percentage}
                    />
                  </div>

                  {/* Size Selection */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Select Size</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <Button
                            key={size}
                            variant={selectedSize === size ? "default" : "outline"}
                            onClick={() => setSelectedSize(size)}
                            className="w-14 h-14"
                          >
                            {size}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color Selection */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Select Color</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                          <Button
                            key={color}
                            variant={selectedColor === color ? "default" : "outline"}
                            onClick={() => setSelectedColor(color)}
                            className="px-4 py-2"
                          >
                            {color}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Quantity</h3>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button
                      className="flex-1 h-12 text-base"
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 h-12 text-base"
                      onClick={() => setIsWishlist(!isWishlist)}
                    >
                      <Heart
                        className={cn(
                          "w-5 h-5 mr-2",
                          isWishlist && "fill-rose-500"
                        )}
                      />
                      Wishlist
                    </Button>
                  </div>

                  {/* Delivery Info */}
                  <div className="pt-6 space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Truck className="w-5 h-5" />
                      <span>
                        {product.free_delivery_above && product.price * quantity >= product.free_delivery_above
                          ? "Free Delivery"
                          : `Delivery Charges: ${formatIndianPrice(product.delivery_charges || 0)}`}
                      </span>
                    </div>
                    {product.free_delivery_above && product.price * quantity < product.free_delivery_above && (
                      <p className="text-sm text-blue-600">
                        Add items worth {formatIndianPrice(product.free_delivery_above - product.price * quantity)} more for FREE delivery
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Product Description */}
              <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Product Description</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
              </div>

              {/* Reviews Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-16 bg-white rounded-2xl p-6 sm:p-8 shadow-sm"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <ProductReviews reviews={[]} onReviewsUpdate={() => {}} />
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

              {/* Available Coupons */}
              {activeCoupons.length > 0 && (
                <Card className="p-4 sm:p-6 mt-8">
                  <h3 className="text-xl font-semibold mb-4">Available Coupons</h3>
                  <div className="space-y-4">
                    {activeCoupons.map((coupon) => (
                      <div 
                        key={coupon.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-gray-50 gap-4"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-0">
                            <Badge variant="outline" className="text-base sm:text-lg font-mono">
                              {coupon.code}
                            </Badge>
                            <Badge variant="secondary">
                              {coupon.discount_percentage}% OFF
                            </Badge>
                          </div>
                          {coupon.min_purchase_amount > 0 && (
                            <p className="text-sm text-gray-500 mt-1">
                              Min. purchase: {formatIndianPrice(coupon.min_purchase_amount)}
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
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;