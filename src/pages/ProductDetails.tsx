import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProductMediaGallery from "@/components/product/ProductMediaGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import ReviewForm from "@/components/product/ReviewForm";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LuxuryLoader } from "@/components/LuxuryLoader";
import ProductHeader from "@/components/product/ProductHeader";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const [isWishlist, setIsWishlist] = useState(false);

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: reviews, isLoading: reviewsLoading, refetch: refetchReviews } = useQuery({
    queryKey: ["product-reviews", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq("product_id", id)
        .order("created_at", { ascending: false });

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

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add item to cart",
        });
        return;
      }

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

  if (productLoading) {
    return <LuxuryLoader />;
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-luxury-pearl/20">
        <h2 className="text-2xl font-serif mb-4">Product not found</h2>
        <Link 
          to="/products" 
          className="text-luxury-gold hover:text-luxury-gold/80 flex items-center transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-8 flex justify-between items-center"
        >
          <Link 
            to="/products"
            className="inline-flex items-center text-luxury-gold hover:text-luxury-gold/80 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Products
          </Link>
          <button
            onClick={() => setIsWishlist(!isWishlist)}
            className="p-2 rounded-full hover:bg-luxury-pearl/20 transition-colors"
          >
            <Heart 
              className={`w-6 h-6 transition-colors ${
                isWishlist ? 'fill-luxury-gold text-luxury-gold' : 'text-gray-400'
              }`}
            />
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-24 h-fit"
          >
            <ProductMediaGallery 
              images={product.images} 
              title={product.title} 
              video_url={product.video_url}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8 bg-white/50 backdrop-blur-sm rounded-xl p-8 h-fit"
          >
            <ProductHeader
              title={product.title}
              price={product.price}
              category={product.category}
            />
            <ProductInfo
              {...product}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              quantity={quantity}
              setSelectedSize={setSelectedSize}
              setSelectedColor={setSelectedColor}
              setQuantity={setQuantity}
              onAddToCart={handleAddToCart}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-gradient-to-br from-luxury-pearl/30 to-luxury-cream/30 rounded-xl p-8 backdrop-blur-sm"
        >
          <div className="grid lg:grid-cols-2 gap-12">
            <ProductReviews
              reviews={reviews || []}
              onReviewsUpdate={refetchReviews}
            />
            <ReviewForm productId={id!} onSuccess={refetchReviews} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-serif mb-8 text-center">You May Also Like</h2>
          <RelatedProducts currentProductId={id!} category={product.category} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductDetails;