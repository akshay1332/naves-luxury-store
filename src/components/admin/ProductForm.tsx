import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import ProductFormFields from "./ProductFormFields";

interface ProductFormProps {
  initialData?: {
    id: string;
    title: string;
    description: string;
    price: number;
    sizes: string[];
    colors: string[];
    images: string[];
    stock_quantity: number;
    is_featured: boolean;
    is_best_seller: boolean;
    category: string;
    gender: string;
  };
  onSuccess?: () => void;
}

const ProductForm = ({ initialData, onSuccess }: ProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images || []);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const productData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        stock_quantity: parseInt(formData.get('stock_quantity') as string),
        sizes: (formData.get('sizes') as string).split(',').map(s => s.trim()),
        colors: (formData.get('colors') as string).split(',').map(c => c.trim()),
        is_featured: formData.get('is_featured') === 'on',
        is_best_seller: formData.get('is_best_seller') === 'on',
        category: formData.get('category') as string,
        gender: formData.get('gender') as string,
        images: imageUrls,
      };

      if (initialData) {
        const { error } = await supabase
          .from('products')
          .update({
            ...productData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Product ${initialData ? 'updated' : 'created'} successfully.`,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/admin/products');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProductFormFields
        initialData={initialData}
        loading={loading}
        onImageAdd={(url) => setImageUrls([...imageUrls, url])}
        onImageRemove={(index) => setImageUrls(prev => prev.filter((_, i) => i !== index))}
        imageUrls={imageUrls}
      />
      <Button 
        type="submit" 
        disabled={loading}
        className="w-full bg-luxury-gold hover:bg-luxury-gold/90"
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {initialData ? 'Update Product' : 'Create Product'}
      </Button>
    </form>
  );
};

export default ProductForm;