import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ProductContainer from "@/components/product/ProductContainer";
import ProductContent from "@/components/product/ProductContent";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import { ReviewForm } from "@/components/product/ReviewForm";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch product details",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <ProductContainer>
      <ProductContent product={product} />
      <ReviewForm productId={product.id} />
      <ProductReviews productId={product.id} />
      <RelatedProducts categoryId={product.category} />
    </ProductContainer>
  );
}
