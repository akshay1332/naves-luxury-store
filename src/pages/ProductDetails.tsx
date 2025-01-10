import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LuxuryLoader } from "@/components/LuxuryLoader";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import ReviewForm from "@/components/product/ReviewForm";
import { motion } from "framer-motion";
import ProductContainer from "@/components/product/ProductContainer";
import ProductContent from "@/components/product/ProductContent";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const { toast } = useToast();

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
      </div>
    );
  }

  return (
    <ProductContainer id={id!} isWishlist={isWishlist} setIsWishlist={setIsWishlist}>
      <ProductContent
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        quantity={quantity}
        setSelectedSize={setSelectedSize}
        setSelectedColor={setSelectedColor}
        setQuantity={setQuantity}
        onAddToCart={handleAddToCart}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-16 bg-gradient-to-br from-luxury-pearl/30 to-luxury-cream/30 rounded-xl p-4 md:p-8 backdrop-blur-sm"
      >
        <div className="grid lg:grid-cols-2 gap-12">
          <ProductReviews
            reviews={[]}
            onReviewsUpdate={() => {}}
          />
          <ReviewForm productId={id!} onSuccess={() => {}} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16"
      >
        <RelatedProducts currentProductId={id!} category={product.category} />
      </motion.div>
    </ProductContainer>
  );
};

export default ProductDetails;