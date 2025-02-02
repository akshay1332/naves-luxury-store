import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, Plus, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  style_category: z.string().min(1, 'Style category is required'),
  stock_quantity: z.number().min(0, 'Stock quantity must be positive'),
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  gender: z.string(),
  is_featured: z.boolean(),
  is_best_seller: z.boolean(),
  is_new_arrival: z.boolean(),
  is_trending: z.boolean(),
  images: z.array(z.string()).optional(),
  video_url: z.string().optional(),
  sale_percentage: z.number().min(0).max(100).optional(),
  sale_start_date: z.date().optional(),
  sale_end_date: z.date().optional(),
  quick_view_data: z.object({
    material: z.string(),
    fit: z.string(),
    care_instructions: z.array(z.string()),
    features: z.array(z.string())
  }),
  key_highlights: z.object({
    fit_type: z.string(),
    fabric: z.string(),
    neck: z.string(),
    sleeve: z.string(),
    pattern: z.string(),
    length: z.string()
  })
});

type ProductFormProps = {
  initialData?: z.infer<typeof productSchema>;
  onSuccess?: () => void;
};

const ProductForm = ({ initialData, onSuccess }: ProductFormProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [careInstructions, setCareInstructions] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [newCareInstruction, setNewCareInstruction] = useState('');
  const [newFeature, setNewFeature] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      price: 0,
      category: '',
      style_category: '',
      stock_quantity: 0,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
      colors: [],
      gender: 'unisex',
      is_featured: false,
      is_best_seller: false,
      is_new_arrival: false,
      is_trending: false,
      images: [],
      video_url: '',
      sale_percentage: 0,
      quick_view_data: {
        material: '',
        fit: '',
        care_instructions: [],
        features: []
      },
      key_highlights: {
        fit_type: '',
        fabric: '',
        neck: '',
        sleeve: '',
        pattern: '',
        length: ''
      }
    }
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 3 * 1024 * 1024) {
          toast({
            title: 'Error',
            description: `File ${file.name} exceeds 3MB limit`,
            variant: 'destructive'
          });
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) {
          toast({
            title: 'Error',
            description: `Failed to upload ${file.name}`,
            variant: 'destructive'
          });
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      setValue('images', uploadedUrls);
      toast({
        title: 'Success',
        description: 'Images uploaded successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload images',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const addCareInstruction = () => {
    if (newCareInstruction) {
      setCareInstructions([...careInstructions, newCareInstruction]);
      setNewCareInstruction('');
    }
  };

  const addFeature = () => {
    if (newFeature) {
      setFeatures([...features, newFeature]);
      setNewFeature('');
    }
  };

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    try {
      const { error } = await supabase
        .from('products')
        .insert([{
          ...data,
          quick_view_data: {
            ...data.quick_view_data,
            care_instructions: careInstructions,
            features: features
          }
        }]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product created successfully'
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create product',
        variant: 'destructive'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input {...register('title')} />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Input {...register('category')} />
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea {...register('description')} />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Images & Media */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Images & Media</h3>
        <div className="flex gap-2">
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
          <Button type="button" onClick={handleImageUpload}>
            <Upload className="w-4 h-4" />
          </Button>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Video URL (optional)</label>
          <Input {...register('video_url')} placeholder="Enter video URL" />
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Pricing & Stock</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <Input type="number" {...register('price', { valueAsNumber: true })} />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock Quantity</label>
            <Input
              type="number"
              {...register('stock_quantity', { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sale Percentage (%)</label>
            <Input
              type="number"
              {...register('sale_percentage', { valueAsNumber: true })}
              min="0"
              max="100"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sale Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watch('sale_start_date') && "text-muted-foreground"
                  )}
                >
                  {watch('sale_start_date') ? 
                    format(watch('sale_start_date'), "PPP") : 
                    "Pick a date"
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={watch('sale_start_date')}
                  onSelect={(date) => setValue('sale_start_date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sale End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watch('sale_end_date') && "text-muted-foreground"
                  )}
                >
                  {watch('sale_end_date') ? 
                    format(watch('sale_end_date'), "PPP") : 
                    "Pick a date"
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={watch('sale_end_date')}
                  onSelect={(date) => setValue('sale_end_date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Product Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Material</label>
            <Input {...register('quick_view_data.material')} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fit</label>
            <Input {...register('quick_view_data.fit')} />
          </div>
        </div>
        
        {/* Care Instructions */}
        <div>
          <label className="block text-sm font-medium mb-1">Care Instructions</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newCareInstruction}
              onChange={(e) => setNewCareInstruction(e.target.value)}
              placeholder="Add care instruction"
            />
            <Button type="button" onClick={addCareInstruction}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {careInstructions.map((instruction, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded"
              >
                <span>{instruction}</span>
                <button
                  type="button"
                  onClick={() => {
                    setCareInstructions(careInstructions.filter((_, i) => i !== index));
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium mb-1">Features</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add feature"
            />
            <Button type="button" onClick={addFeature}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded"
              >
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => {
                    setFeatures(features.filter((_, i) => i !== index));
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Highlights */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Key Highlights</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fit Type</label>
            <Input {...register('key_highlights.fit_type')} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fabric</label>
            <Input {...register('key_highlights.fabric')} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Neck</label>
            <Input {...register('key_highlights.neck')} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sleeve</label>
            <Input {...register('key_highlights.sleeve')} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pattern</label>
            <Input {...register('key_highlights.pattern')} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Length</label>
            <Input {...register('key_highlights.length')} />
          </div>
        </div>
      </div>

      {/* Product Status */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Product Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_featured"
              {...register('is_featured')}
            />
            <label htmlFor="is_featured">Featured Product</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_best_seller"
              {...register('is_best_seller')}
            />
            <label htmlFor="is_best_seller">Best Seller</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_new_arrival"
              {...register('is_new_arrival')}
            />
            <label htmlFor="is_new_arrival">New Arrival</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_trending"
              {...register('is_trending')}
            />
            <label htmlFor="is_trending">Trending</label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {initialData ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            initialData ? 'Update Product' : 'Create Product'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
