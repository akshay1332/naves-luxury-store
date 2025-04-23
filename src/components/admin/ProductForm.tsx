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
  "New Arrivals",
  "Polo T-Shirts"
];

const GENDERS = ["men", "women", "unisex"] as const;
const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const DEFAULT_COLORS = [
  // { name: "Black", value: "#000000" },
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
  //"Vintage",
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
  size_chart_image?: string;
  quick_view_data: {
    features: string[];
    care_instructions: string[];
  };
  sale_percentage: number;
  sale_start_date?: string;
  sale_end_date?: string;
  video_url?: string;
  key_highlights: {
    fit?: string;
    fabric?: string;
    neck?: string;
    sleeve?: string;
    pattern?: string;
    length?: string;
    material?: string;
    capacity?: string;
    microwaveSafe?: string;
    dishwasher?: string;
    lidType?: string;
    insulation?: string;
    finish?: string;
    dimensions?: string;
  };
  allows_custom_printing: boolean;
  custom_printing_price: number;
  delivery_charges: number;
  free_delivery_above: number;
  custom_printing_options: {
    small_locations: {
      left_chest: number;
      center_chest: number;
      right_chest: number;
      back: number;
    };
    medium_locations: {
      front: number;
      back: number;
      both: number;
    };
    large_locations: {
      full_front: number;
      full_back: number;
      both: number;
    };
    across_chest: number;
  };
  printing_guide: {
    image_url: string;
    description: string;
    updated_at?: string;
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
      size_chart_image: initialData?.size_chart_image || "",
      quick_view_data: {
        features: initialData?.quick_view_data?.features || [],
        care_instructions: initialData?.quick_view_data?.care_instructions || []
      },
      sale_percentage: initialData?.sale_percentage || 0,
      sale_start_date: initialData?.sale_start_date || "",
      sale_end_date: initialData?.sale_end_date || "",
      video_url: initialData?.video_url || "",
      key_highlights: {
        fit: initialData?.key_highlights?.fit || "",
        fabric: initialData?.key_highlights?.fabric || "",
        neck: initialData?.key_highlights?.neck || "",
        sleeve: initialData?.key_highlights?.sleeve || "",
        pattern: initialData?.key_highlights?.pattern || "",
        length: initialData?.key_highlights?.length || "",
        material: initialData?.key_highlights?.material || "",
        capacity: initialData?.key_highlights?.capacity || "",
        microwaveSafe: initialData?.key_highlights?.microwaveSafe || "",
        dishwasher: initialData?.key_highlights?.dishwasher || "",
        lidType: initialData?.key_highlights?.lidType || "",
        insulation: initialData?.key_highlights?.insulation || "",
        finish: initialData?.key_highlights?.finish || "",
        dimensions: initialData?.key_highlights?.dimensions || "",
      },
      allows_custom_printing: initialData?.allows_custom_printing || false,
      custom_printing_price: initialData?.custom_printing_price || 0,
      delivery_charges: initialData?.delivery_charges || 0,
      free_delivery_above: initialData?.free_delivery_above || 499,
      custom_printing_options: {
        small_locations: {
          left_chest: initialData?.custom_printing_options?.small_locations?.left_chest || 0,
          center_chest: initialData?.custom_printing_options?.small_locations?.center_chest || 0,
          right_chest: initialData?.custom_printing_options?.small_locations?.right_chest || 0,
          back: initialData?.custom_printing_options?.small_locations?.back || 0,
        },
        medium_locations: {
          front: initialData?.custom_printing_options?.medium_locations?.front || 0,
          back: initialData?.custom_printing_options?.medium_locations?.back || 0,
          both: initialData?.custom_printing_options?.medium_locations?.both || 0,
        },
        large_locations: {
          full_front: initialData?.custom_printing_options?.large_locations?.full_front || 0,
          full_back: initialData?.custom_printing_options?.large_locations?.full_back || 0,
          both: initialData?.custom_printing_options?.large_locations?.both || 0,
        },
        across_chest: initialData?.custom_printing_options?.across_chest || 0,
      },
      printing_guide: {
        image_url: initialData?.printing_guide?.image_url || "",
        description: initialData?.printing_guide?.description || "",
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

      // Format the custom printing options
      const custom_printing_options = {
        small_locations: {
          left_chest: Number(data.custom_printing_options?.small_locations?.left_chest || 0),
          center_chest: Number(data.custom_printing_options?.small_locations?.center_chest || 0),
          right_chest: Number(data.custom_printing_options?.small_locations?.right_chest || 0),
          back: Number(data.custom_printing_options?.small_locations?.back || 0),
        },
        medium_locations: {
          front: Number(data.custom_printing_options?.medium_locations?.front || 0),
          back: Number(data.custom_printing_options?.medium_locations?.back || 0),
          both: Number(data.custom_printing_options?.medium_locations?.both || 0),
        },
        large_locations: {
          full_front: Number(data.custom_printing_options?.large_locations?.full_front || 0),
          full_back: Number(data.custom_printing_options?.large_locations?.full_back || 0),
          both: Number(data.custom_printing_options?.large_locations?.both || 0),
        },
        across_chest: Number(data.custom_printing_options?.across_chest || 0),
      };

      // Format key highlights to ensure all values are strings
      const key_highlights = Object.entries(data.key_highlights || {}).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: String(value || '')
      }), {});

      const productData = {
        title: data.title.trim(),
        description: data.description.trim(),
        price: Number(data.price),
        category: data.category.trim(),
        gender: data.gender.trim(),
        stock_quantity: Number(data.stock_quantity),
        colors: selectedColors,
        sizes: selectedSizes,
        images: data.images || [],
        is_featured: Boolean(data.is_featured),
        is_best_seller: Boolean(data.is_best_seller),
        is_new_arrival: Boolean(data.is_new_arrival),
        style_category: data.style_category.trim(),
        size_chart_image: data.size_chart_image || "",
        quick_view_data,
        sale_percentage: Number(data.sale_percentage || 0),
        sale_start_date: data.sale_start_date || null,
        sale_end_date: data.sale_end_date || null,
        video_url: data.video_url?.trim() || null,
        key_highlights,
        allows_custom_printing: Boolean(data.allows_custom_printing),
        custom_printing_price: Number(data.custom_printing_price || 0),
        delivery_charges: Number(data.delivery_charges || 0),
        free_delivery_above: Number(data.free_delivery_above || 499),
        custom_printing_options,
        printing_guide: {
          image_url: data.printing_guide.image_url || "",
          description: data.printing_guide.description || "",
          updated_at: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      };

      if (isEditMode) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', initialData.id);

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(error.message);
        }

        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(error.message);
        }

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
        description: error.message || "Failed to save product. Please check all fields and try again.",
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

  // Update the ProductDetails component
  const ProductDetails = ({ form }: { form: any }) => {
    const category = form.watch("category")?.toLowerCase();
    const isCup = category?.includes('cup');
    const isBottle = category?.includes('bottle');

    if (isCup) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Product Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Material</Label>
              <Input
                {...form.register("key_highlights.material")}
                placeholder="Enter material type"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Capacity</Label>
              <Input
                {...form.register("key_highlights.capacity")}
                placeholder="Enter capacity"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Dimensions</Label>
              <Input
                {...form.register("key_highlights.dimensions")}
                placeholder="Enter dimensions (e.g., 8cm x 10cm)"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Microwave Safe</Label>
              <Input
                {...form.register("key_highlights.microwaveSafe")}
                placeholder="Enter microwave safety details"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Dishwasher</Label>
              <Input
                {...form.register("key_highlights.dishwasher")}
                placeholder="Enter dishwasher safety details"
                className="bg-white"
              />
            </div>
          </div>
        </div>
      );
    }

    if (isBottle) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Product Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Material</Label>
              <Input
                {...form.register("key_highlights.material")}
                placeholder="Enter material type"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Capacity</Label>
              <Input
                {...form.register("key_highlights.capacity")}
                placeholder="Enter capacity"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Dimensions</Label>
              <Input
                {...form.register("key_highlights.dimensions")}
                placeholder="Enter dimensions (e.g., 7cm x 25cm)"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Lid Type</Label>
              <Input
                {...form.register("key_highlights.lidType")}
                placeholder="Enter lid type"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Insulation</Label>
              <Input
                {...form.register("key_highlights.insulation")}
                placeholder="Enter insulation type"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Pattern</Label>
              <Input
                {...form.register("key_highlights.pattern")}
                placeholder="Enter pattern type"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Finish</Label>
              <Input
                {...form.register("key_highlights.finish")}
                placeholder="Enter finish type"
                className="bg-white"
              />
            </div>
          </div>
        </div>
      );
    }

    // Default clothing fields
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Product Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Fit</Label>
            <Input
              {...form.register("key_highlights.fit")}
              placeholder="Enter product fit"
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label>Fabric</Label>
            <Input
              {...form.register("key_highlights.fabric")}
              placeholder="Enter fabric details"
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label>Neck</Label>
            <Input
              {...form.register("key_highlights.neck")}
              placeholder="Enter neck style"
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label>Sleeve</Label>
            <Input
              {...form.register("key_highlights.sleeve")}
              placeholder="Enter sleeve type"
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label>Pattern</Label>
            <Input
              {...form.register("key_highlights.pattern")}
              placeholder="Enter pattern type"
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label>Length</Label>
            <Input
              {...form.register("key_highlights.length")}
              placeholder="Enter length type"
              className="bg-white"
            />
          </div>
        </div>
      </div>
    );
  };

  // Add these components for size and color selection
  const SizesSection = () => {
    const handleSizeToggle = (size: string) => {
      setSelectedSizes(prev => 
        prev.includes(size) 
          ? prev.filter(s => s !== size)
          : [...prev, size]
      );
      // Update form data
      form.setValue('sizes', selectedSizes.includes(size) 
        ? selectedSizes.filter(s => s !== size)
        : [...selectedSizes, size]
      );
    };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Available Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_SIZES.map(size => (
            <Button
              key={size}
              type="button"
              variant={selectedSizes.includes(size) ? "default" : "outline"}
              onClick={() => handleSizeToggle(size)}
              className="w-12 h-12"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const ColorsSection = () => {
    const handleColorToggle = (color: string) => {
      setSelectedColors(prev => 
        prev.includes(color) 
          ? prev.filter(c => c !== color)
          : [...prev, color]
      );
      // Update form data
      form.setValue('colors', selectedColors.includes(color) 
        ? selectedColors.filter(c => c !== color)
        : [...selectedColors, color]
      );
    };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Available Colors</h3>
        <div className="flex flex-wrap gap-3">
          {DEFAULT_COLORS.map(color => (
            <button
              key={color.name}
              type="button"
              onClick={() => handleColorToggle(color.name)}
              className={cn(
                "w-10 h-10 rounded-full border-2 transition-all",
                selectedColors.includes(color.name)
                  ? "ring-2 ring-primary ring-offset-2 scale-110"
                  : "hover:scale-110"
              )}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>
    );
  };

  // Add this new component for delivery settings
  const DeliverySettings = ({ form }: { form: any }) => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Delivery Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Delivery Charges (₹)</Label>
            <Input
              type="number"
              {...form.register("delivery_charges")}
              placeholder="Enter delivery charges"
              className="bg-white"
            />
            <p className="text-sm text-gray-500">
              Standard delivery charges for this product
            </p>
          </div>
          <div className="space-y-2">
            <Label>Free Delivery Above (₹)</Label>
            <Input
              type="number"
              {...form.register("free_delivery_above")}
              placeholder="Enter minimum amount for free delivery"
              className="bg-white"
            />
            <p className="text-sm text-gray-500">
              Order amount above which delivery will be free
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Add this new component for custom printing options
  const CustomPrintingSettings = ({ form }: { form: any }) => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Custom Printing Options</h3>
        
        {/* Small Locations */}
        <div className="space-y-4">
          <h4 className="font-medium">Small Size Locations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Left Chest (₹)</Label>
              <Input
                type="number"
                {...form.register("custom_printing_options.small_locations.left_chest")}
                placeholder="Price for left chest"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Center Chest (₹)</Label>
              <Input
                type="number"
                {...form.register("custom_printing_options.small_locations.center_chest")}
                placeholder="Price for center chest"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Right Chest (₹)</Label>
              <Input
                type="number"
                {...form.register("custom_printing_options.small_locations.right_chest")}
                placeholder="Price for right chest"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Back (₹)</Label>
              <Input
                type="number"
                {...form.register("custom_printing_options.small_locations.back")}
                placeholder="Price for back"
                className="bg-white"
              />
            </div>
          </div>
        </div>

        {/* Medium Locations */}
        <div className="space-y-4">
          <h4 className="font-medium">Medium Size Locations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Front (₹)</Label>
              <Input
                type="number"
                {...form.register("custom_printing_options.medium_locations.front")}
                placeholder="Price for front"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Back (₹)</Label>
              <Input
                type="number"
                {...form.register("custom_printing_options.medium_locations.back")}
                placeholder="Price for back"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Both (₹)</Label>
              <Input
                type="number"
                {...form.register("custom_printing_options.medium_locations.both")}
                placeholder="Price for both sides"
                className="bg-white"
              />
            </div>
          </div>
        </div>

        {/* Large Locations */}
        <div className="space-y-4">
          <h4 className="font-medium">Large Size Locations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Front (₹)</Label>
              <Input
                type="number"
                {...form.register("custom_printing_options.large_locations.full_front")}
                placeholder="Price for full front"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Full Back (₹)</Label>
              <Input
                type="number"
                {...form.register("custom_printing_options.large_locations.full_back")}
                placeholder="Price for full back"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Both (₹)</Label>
              <Input
                type="number"
                {...form.register("custom_printing_options.large_locations.both")}
                placeholder="Price for both sides"
                className="bg-white"
              />
            </div>
          </div>
        </div>

        {/* Across Chest */}
        <div className="space-y-4">
          <h4 className="font-medium">Additional Options</h4>
          <div className="space-y-2">
            <Label>Across Chest (₹)</Label>
            <Input
              type="number"
              {...form.register("custom_printing_options.across_chest")}
              placeholder="Price for across chest"
              className="bg-white"
            />
          </div>
        </div>

        {/* Printing Guide */}
        <div className="space-y-4">
          <h4 className="font-medium">Printing Guide</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Guide Image URL</Label>
              <Input
                type="url"
                {...form.register("printing_guide.image_url")}
                placeholder="Enter image URL for printing guide"
                className="bg-white"
              />
              <p className="text-sm text-gray-500">Enter a direct URL to the printing guide image</p>
            </div>
            <div className="space-y-2">
              <Label>Guide Description</Label>
              <Textarea
                {...form.register("printing_guide.description")}
                placeholder="Enter printing guide instructions"
                className="bg-white min-h-[100px]"
              />
            </div>
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
              <DeliverySettings form={form} />
              <Features form={form} initialData={initialData} />
              <CustomPrintingSettings form={form} />
              
              {/* Add Size and Color sections */}
              <SizesSection />
              <ColorsSection />
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
