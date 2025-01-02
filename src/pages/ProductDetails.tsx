import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductReviews from "@/components/product/ProductReviews";
import ReviewForm from "@/components/product/ReviewForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: string[];
  stock_quantity: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  admin_response: string | null;
  profiles: {
    full_name: string;
  };
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch product details.",
      });
      navigate('/products');
      return;
    }

    setProduct(data);
    setLoading(false);
  };

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        created_at,
        admin_response,
        profiles (
          full_name
        )
      `)
      .eq('product_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return;
    }

    setReviews(data || []);
  };

  const addToCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
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
        description: "Failed to add item to cart.",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Item added to cart successfully.",
    });
  };

  if (loading || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
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
          onAddToCart={addToCart}
        />
      </div>

      <div className="mt-16">
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="write-review">Write a Review</TabsTrigger>
          </TabsList>
          <TabsContent value="reviews">
            <ProductReviews reviews={reviews} />
          </TabsContent>
          <TabsContent value="write-review">
            <div className="max-w-2xl mx-auto">
              <ReviewForm productId={id!} onSuccess={fetchReviews} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}