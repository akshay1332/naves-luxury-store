import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { BasicDetails } from "./product-form/BasicDetails";
import { PricingStock } from "./product-form/PricingStock";
import { Features } from "./product-form/Features";
import { ImageUpload } from "./product-form/ImageUpload";
import { Variants } from "./product-form/Variants";
import { ProductFormActions } from "./product-form/ProductFormActions";
import { ProductFormHeader } from "./product-form/ProductFormHeader";

const PRODUCT_CATEGORIES = [
  "Hoodies",
  "T-Shirts",
  "Sweatshirts",
  "Oversized",
  "Limited Edition",
  "New Arrivals"
];

const GENDERS = ["men", "women", "unisex"] as const;
const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const DEFAULT_COLORS = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Gray", value: "#808080" },
  { name: "Red", value: "#FF0000" },
  { name: "Blue", value: "#0000FF" },
  { name: "Green", value: "#00FF00" },
  { name: "Yellow", value: "#FFFF00" },
  { name: "Purple", value: "#800080" },
  { name: "Pink", value: "#FFC0CB" },
  { name: "Orange", value: "#FFA500" },
];

const STYLE_CATEGORIES = [
  "Casual",
  "Streetwear",
  "Athletic",
  "Formal",
  "Vintage",
  "Modern",
  "Classic",
];

interface ProductFormProps {
  initialData?: any;
  onSuccess: () => void;
}

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  gender: string;
  stock_quantity: number;
  colors: string[];
  sizes: string[];
  images: string[];
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  style_category: string;
  quick_view_data: {
    features: string[];
    care_instructions: string[];
  };
  sale_percentage: number;
  sale_start_date?: string;
  sale_end_date?: string;
  video_url?: string;
  key_highlights?: string[];
  allows_custom_printing: boolean;
  custom_printing_price: number;
  key_highlights: {
    fit: string;
    fabric: string;
    neck: string;
    sleeve: string;
    pattern: string;
    length: string;
  };
}

const ProductForm = ({ initialData, onSuccess }: ProductFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialData?.id; // Check if we're in edit mode
  const [selectedColors, setSelectedColors] = useState<string[]>(initialData?.colors || []);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialData?.sizes || []);
  const [careInstructions, setCareInstructions] = useState<string[]>(
    initialData?.quick_view_data?.care_instructions || []
  );
  const [features, setFeatures] = useState<string[]>(
    initialData?.quick_view_data?.features || []
  );
  const MAX_IMAGES = 10;
  const [imageLink, setImageLink] = useState("");

  const form = useForm<ProductFormData>({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      category: initialData?.category || "",
      gender: initialData?.gender || "",
      stock_quantity: initialData?.stock_quantity || 0,
      colors: initialData?.colors || [],
      sizes: initialData?.sizes || [],
      images: initialData?.images || [],
      is_featured: initialData?.is_featured || false,
      is_best_seller: initialData?.is_best_seller || false,
      is_new_arrival: initialData?.is_new_arrival || false,
      style_category: initialData?.style_category || "",
      quick_view_data: {
        features: initialData?.quick_view_data?.features || [],
        care_instructions: initialData?.quick_view_data?.care_instructions || []
      },
      sale_percentage: initialData?.sale_percentage || 0,
      sale_start_date: initialData?.sale_start_date || "",
      sale_end_date: initialData?.sale_end_date || "",
      video_url: initialData?.video_url || "",
      key_highlights: initialData?.key_highlights || [],
      allows_custom_printing: initialData?.allows_custom_printing || false,
      custom_printing_price: initialData?.custom_printing_price || 0,
      key_highlights: {
        fit: initialData?.key_highlights?.fit || "",
        fabric: initialData?.key_highlights?.fabric || "",
        neck: initialData?.key_highlights?.neck || "",
        sleeve: initialData?.key_highlights?.sleeve || "", 
        pattern: initialData?.key_highlights?.pattern || "",
        length: initialData?.key_highlights?.length || ""
      },
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (form.getValues('images').length + files.length > MAX_IMAGES) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `You can only upload a maximum of ${MAX_IMAGES} images. Currently ${form.getValues('images').length} images are uploaded.`,
      });
      return;
    }

    setLoading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      form.setValue('images', [...form.getValues('images'), ...uploadedUrls]);

      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload images. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update the convertGoogleDriveLink function to handle multiple Google link formats
  const convertGoogleDriveLink = (url: string) => {
    // Handle Google Drive links
    const driveRegex = {
      standard: /drive\.google\.com\/file\/d\/(.*?)\/view/,
      sharing: /drive\.google\.com\/open\?id=(.*?)(?:$|&)/,
      alternate: /drive\.google\.com\/uc\?id=(.*?)(?:$|&)/
    };

    // Handle Google Photos links
    const photosRegex = {
      standard: /photos\.google\.com\/share\/(.*?)$/,
      alternate: /photos\.app\.goo\.gl\/(.*?)$/
    };

    // Check for Google Drive links
    for (const [key, regex] of Object.entries(driveRegex)) {
      const match = url.match(regex);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }

    // Check for Google Photos links
    for (const [key, regex] of Object.entries(photosRegex)) {
      const match = url.match(regex);
      if (match) {
        // For Google Photos, we'll try to extract the actual image URL
        return url.replace(/\=w\d+-h\d+/, '=w1000-h1000');
      }
    }

    // If no Google link patterns match, return the original URL
    return url;
  };

  // Update the handleAddImageLink function with a simpler approach
  const handleAddImageLink = () => {
    if (!imageLink) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an image URL",
      });
      return;
    }

    if (form.getValues('images').length >= MAX_IMAGES) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Maximum ${MAX_IMAGES} images allowed`,
      });
      return;
    }

    // Add the URL directly without verification
    form.setValue('images', [...form.getValues('images'), imageLink]);
    setImageLink("");
    toast({
      title: "Success",
      description: "Image link added. Please verify the image appears correctly in the preview.",
    });
  };

  const handleRemoveImage = (index: number) => {
    form.setValue('images', form.getValues('images').filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);

    try {
      // Ensure quick_view_data exists with default values
      const quick_view_data = {
        features: data.quick_view_data?.features || [],
        care_instructions: data.quick_view_data?.care_instructions || []
      };

      const productData = {
        title: data.title.trim(),
        description: data.description.trim(),
        price: Number(data.price),
        category: data.category.trim(),
        gender: data.gender.trim(),
        stock_quantity: Number(data.stock_quantity),
        colors: data.colors || [],
        sizes: data.sizes || [],
        images: data.images || [],
        is_featured: data.is_featured || false,
        is_best_seller: data.is_best_seller || false,
        is_new_arrival: data.is_new_arrival || false,
        style_category: data.style_category.trim(),
        quick_view_data, // Use the safely constructed object
        sale_percentage: Number(data.sale_percentage || 0),
        sale_start_date: data.sale_start_date || null,
        sale_end_date: data.sale_end_date || null,
        video_url: data.video_url?.trim() || null,
        key_highlights: data.key_highlights || [],
        allows_custom_printing: data.allows_custom_printing || false,
        custom_printing_price: Number(data.custom_printing_price || 0),
        key_highlights: {
          fit: data.key_highlights.fit,
          fabric: data.key_highlights.fabric,
          neck: data.key_highlights.neck,
          sleeve: data.key_highlights.sleeve,
          pattern: data.key_highlights.pattern,
          length: data.key_highlights.length
        },
        updated_at: new Date().toISOString()
      };

      if (isEditMode) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', initialData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save product",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to get image URL with cache busting
  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('storage.googleapis.com') || url.includes('supabase')) {
      return `${url}?t=${new Date().getTime()}`;
    }
    return url;
  };

  // Update the status and stock display styles
  const getStatusBadgeStyles = (status: string) => {
    return cn(
      "px-2 py-1 rounded-full text-xs font-medium",
      "bg-white text-black border border-black"
    );
  };

  const getStockBadgeStyles = (stockLevel: number) => {
    return cn(
      "px-2 py-1 rounded-full text-xs font-medium",
      "bg-white text-black border border-black"
    );
  };

  // Create a new component for product details
  const ProductDetails = ({ form }: { form: any }) => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Product Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Fit</Label>
            <Input
              {...form.register("key_highlights.fit")}
              placeholder="Enter product fit"
            />
          </div>
          <div className="space-y-2">
            <Label>Fabric</Label>
            <Input
              {...form.register("key_highlights.fabric")}
              placeholder="Enter fabric details"
            />
          </div>
          <div className="space-y-2">
            <Label>Neck</Label>
            <Input
              {...form.register("key_highlights.neck")}
              placeholder="Enter neck style"
            />
          </div>
          <div className="space-y-2">
            <Label>Sleeve</Label>
            <Input
              {...form.register("key_highlights.sleeve")}
              placeholder="Enter sleeve type"
            />
          </div>
          <div className="space-y-2">
            <Label>Pattern</Label>
            <Input
              {...form.register("key_highlights.pattern")}
              placeholder="Enter pattern type"
            />
          </div>
          <div className="space-y-2">
            <Label>Length</Label>
            <Input
              {...form.register("key_highlights.length")}
              placeholder="Enter length type"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">
            {isEditMode ? 'Edit Product' : 'Create New Product'}
          </h1>
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <ProductFormHeader />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <BasicDetails form={form} initialData={initialData} />
              <ProductDetails form={form} />
              <PricingStock form={form} initialData={initialData} />
              <Features form={form} initialData={initialData} />
            </div>
            
            <div className="space-y-8">
              <ImageUpload form={form} initialData={initialData} />
              <Variants form={form} initialData={initialData} />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              className="border-black text-black hover:bg-black hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={loading}
              className="bg-black text-white hover:bg-black/90"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                isEditMode ? 'Update Product' : 'Create Product'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default ProductForm;
