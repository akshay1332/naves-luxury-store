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

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-12">
        <ProductImageGallery images={product.images} title={product.title} />
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
      </div>

      <div className="mt-16">
        <div className="grid md:grid-cols-2 gap-12">
          <ProductReviews
            reviews={reviews || []}
            isAdmin={userProfile?.is_admin}
            onReviewsUpdate={refetchReviews}
          />
          <ReviewForm productId={id!} onSuccess={refetchReviews} />
        </div>
      </div>

      <RelatedProducts currentProductId={id!} category={product.category} />
    </div>
  );
};

export default ProductDetails;