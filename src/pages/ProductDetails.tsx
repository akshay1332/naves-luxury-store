import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductContainer } from "@/components/product/ProductContainer";
import { ProductContent } from "@/components/product/ProductContent";
import { ProductReviews } from "@/components/product/ProductReviews";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ReviewForm } from "@/components/product/ReviewForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isWishlist, setIsWishlist] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

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

  const handleAddToCart = () => {
    // Add your add to cart logic here
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <ProductContainer
      id={id!}
      isWishlist={isWishlist}
      setIsWishlist={setIsWishlist}
    >
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
      {user && (
        <ReviewForm
          productId={product.id}
          userId={user.id}
        />
      )}
      <ProductReviews
        reviews={[]}
        isAdmin={false}
        onReviewsUpdate={fetchProduct}
      />
      <RelatedProducts
        currentProductId={product.id}
        category={product.category}
      />
    </ProductContainer>
  );
}
