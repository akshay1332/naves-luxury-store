import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X } from "lucide-react";

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
  };
  onSuccess?: () => void;
}

const ProductForm = ({ initialData, onSuccess }: ProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
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
      };

      // Upload images if any
      const uploadedImageUrls = [...imageUrls];
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const filePath = `${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        uploadedImageUrls.push(publicUrl);
      }

      if (initialData) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            ...productData,
            images: uploadedImageUrls,
            updated_at: new Date().toISOString(),
          })
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert({
            ...productData,
            images: uploadedImageUrls,
          });

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          name="title"
          defaultValue={initialData?.title}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          name="description"
          defaultValue={initialData?.description}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Price</label>
          <Input
            name="price"
            type="number"
            step="0.01"
            defaultValue={initialData?.price}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Stock Quantity</label>
          <Input
            name="stock_quantity"
            type="number"
            defaultValue={initialData?.stock_quantity}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Sizes (comma-separated)</label>
        <Input
          name="sizes"
          defaultValue={initialData?.sizes?.join(', ')}
          placeholder="S, M, L, XL"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Colors (comma-separated)</label>
        <Input
          name="colors"
          defaultValue={initialData?.colors?.join(', ')}
          placeholder="Red, Blue, Green"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <Input
            type="checkbox"
            name="is_featured"
            defaultChecked={initialData?.is_featured}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Featured Product</span>
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Images</label>
        <div className="grid grid-cols-4 gap-4">
          {imageUrls.map((url, index) => (
            <div key={url} className="relative">
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            <Plus className="w-6 h-6 text-gray-400" />
          </label>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {initialData ? 'Update Product' : 'Create Product'}
      </Button>
    </form>
  );
};

export default ProductForm;