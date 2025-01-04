import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import ReviewForm from "@/components/product/ReviewForm";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LuxuryLoader } from "@/components/LuxuryLoader";
import ProductHeader from "@/components/product/ProductHeader";
import { motion } from "framer-motion";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
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
          title: "Error",
          description: "Please login to add items to cart",
        });
        return;
      }

      const { error } = await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: id,
          quantity,
          size: selectedSize,
          color: selectedColor,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item added to cart",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart",
      });
    }
  };

  if (productLoading || reviewsLoading) {
    return <LuxuryLoader />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <div className="grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ProductImageGallery images={product.images} title={product.title} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
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
        className="mt-16"
      >
        <div className="grid md:grid-cols-2 gap-12">
          <ProductReviews
            reviews={reviews || []}
            onReviewsUpdate={refetchReviews}
          />
          <ReviewForm productId={id!} onSuccess={refetchReviews} />
        </div>
      </motion.div>

      <RelatedProducts currentProductId={id!} category={product.category} />
    </motion.div>
  );
};

export default ProductDetails;