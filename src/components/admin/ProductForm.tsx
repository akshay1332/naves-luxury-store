import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import ProductFormFields from "./ProductFormFields";
import { ProductFormHeader } from "./product-form/ProductFormHeader";
import { ProductFormActions } from "./product-form/ProductFormActions";

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
    is_new_arrival?: boolean;
    is_trending?: boolean;
    style_category?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ProductForm = ({ initialData, onSuccess, onCancel }: ProductFormProps) => {
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
        is_new_arrival: formData.get('is_new_arrival') === 'on',
        is_trending: formData.get('is_trending') === 'on',
        category: formData.get('category') as string,
        gender: formData.get('gender') as string,
        style_category: formData.get('style_category') as string,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="p-6">
        <ProductFormHeader 
          title={initialData ? 'Edit Product' : 'Add New Product'}
          onCancel={onCancel || (() => navigate('/admin/products'))}
        />
        <form onSubmit={handleSubmit} className="space-y-6">
          <ProductFormFields
            initialData={initialData}
            loading={loading}
            onImageAdd={(url) => setImageUrls([...imageUrls, url])}
            onImageRemove={(index) => setImageUrls(prev => prev.filter((_, i) => i !== index))}
            imageUrls={imageUrls}
          />
          <ProductFormActions loading={loading} isEditing={!!initialData} />
        </form>
      </Card>
    </motion.div>
  );
};

export default ProductForm;