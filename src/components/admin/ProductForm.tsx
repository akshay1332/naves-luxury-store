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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus, X } from "lucide-react";

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
  initialData?: Product;
  onSuccess: () => void;
}

interface Product {
  id?: string;
    title: string;
    description: string;
    price: number;
  category: string;
  gender: string;
    stock_quantity: number;
    is_featured: boolean;
    is_best_seller: boolean;
  is_new_arrival: boolean;
  is_trending: boolean;
  video_url: string;
  style_category: string;
  sale_percentage: number;
  sale_start_date: string | null;
  sale_end_date: string | null;
  quick_view_data: {
    material: string;
    fit: string;
    care_instructions: string[];
    features: string[];
  };
  key_highlights: {
    fit_type: string;
    fabric: string;
    neck: string;
    sleeve: string;
    pattern: string;
    length: string;
  };
  sizes: string[];
  colors: string[];
  images: string[];
}

interface SupabaseError {
  message: string;
}

interface StorageError {
  message: string;
}

const ProductForm = ({ initialData, onSuccess }: ProductFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [selectedColors, setSelectedColors] = useState<string[]>(initialData?.colors || []);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialData?.sizes || []);
  const [careInstructions, setCareInstructions] = useState<string[]>(
    initialData?.quick_view_data?.care_instructions || []
  );
  const [features, setFeatures] = useState<string[]>(
    initialData?.quick_view_data?.features || []
  );

  const [formData, setFormData] = useState<Product>(
    initialData || {
      title: "",
      description: "",
      price: 0,
      category: "",
      gender: "",
      stock_quantity: 0,
      is_featured: false,
      is_best_seller: false,
      is_new_arrival: false,
      is_trending: false,
      video_url: "",
      style_category: "",
      sale_percentage: 0,
      sale_start_date: null,
      sale_end_date: null,
      quick_view_data: {
        material: "",
        fit: "",
        care_instructions: [],
        features: [],
      },
      key_highlights: {
        fit_type: "",
        fabric: "",
        neck: "",
        sleeve: "",
        pattern: "",
        length: "",
      },
      sizes: [],
      colors: [],
      images: [],
    }
  );

  const [imageLink, setImageLink] = useState("");

  const handleAddImageLink = () => {
    if (imageLink && formData.images.length < 10) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageLink]
      }));
      setImageLink("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        images,
        colors: selectedColors,
        sizes: selectedSizes,
        quick_view_data: {
          ...formData.quick_view_data,
          care_instructions: careInstructions,
          features,
        },
      };

      if (initialData) {
        // Update existing product
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
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([{
            ...productData,
            created_at: new Date().toISOString(),
          }]);

        if (error) throw error;
      toast({
        title: "Success",
          description: "Product created successfully",
        });
      }

      onSuccess();
    } catch (error: unknown) {
      const err = error as SupabaseError;
      console.error('Error saving product:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to save product",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedUrls]);

      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
    } catch (error: unknown) {
      const err = error as StorageError;
      console.error('Error uploading images:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload images",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <Input
              required
              placeholder="Product Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
            <Textarea
              placeholder="Product Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Images & Media */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Images & Media</h2>
            <div className="flex gap-2">
              <Input
                type="text"
                value={imageLink}
                onChange={(e) => setImageLink(e.target.value)}
                placeholder="Enter image URL"
                disabled={formData.images.length >= 10}
              />
              <Button
                type="button"
                onClick={handleAddImageLink}
                disabled={!imageLink || formData.images.length >= 10}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formData.images.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <Input
              placeholder="Video URL (optional)"
              value={formData.video_url}
              onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
            />
          </div>

          {/* Pricing & Stock */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Pricing & Stock</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  required
                  min={0}
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Stock Quantity</Label>
                <Input
                  type="number"
                  required
                  min={0}
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Sale Percentage (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.sale_percentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, sale_percentage: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Sale Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.sale_start_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.sale_start_date ? format(new Date(formData.sale_start_date), "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.sale_start_date ? new Date(formData.sale_start_date) : undefined}
                      onSelect={(date) => setFormData(prev => ({ ...prev, sale_start_date: date?.toISOString() || null }))}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Sale End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.sale_end_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.sale_end_date ? format(new Date(formData.sale_end_date), "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.sale_end_date ? new Date(formData.sale_end_date) : undefined}
                      onSelect={(date) => setFormData(prev => ({ ...prev, sale_end_date: date?.toISOString() || null }))}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Variants</h2>
            <div>
              <Label>Colors</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {DEFAULT_COLORS.map(color => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => {
                      setSelectedColors(prev =>
                        prev.includes(color.name)
                          ? prev.filter(c => c !== color.name)
                          : [...prev, color.name]
                      );
                    }}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 transition-transform hover:scale-110",
                      selectedColors.includes(color.name)
                        ? "border-primary scale-110"
                        : "border-gray-200"
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label>Sizes</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {DEFAULT_SIZES.map(size => (
                  <Button
                    key={size}
                    type="button"
                    variant={selectedSizes.includes(size) ? "default" : "outline"}
                    onClick={() => {
                      setSelectedSizes(prev =>
                        prev.includes(size)
                          ? prev.filter(s => s !== size)
                          : [...prev, size]
                      );
                    }}
                    className="w-12 h-12 rounded-full"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Product Details</h2>
            <Input
              placeholder="Material"
              value={formData.quick_view_data.material}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                quick_view_data: {
                  ...prev.quick_view_data,
                  material: e.target.value
                }
              }))}
            />
            <Input
              placeholder="Fit"
              value={formData.quick_view_data.fit}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                quick_view_data: {
                  ...prev.quick_view_data,
                  fit: e.target.value
                }
              }))}
            />
            <div>
              <Label>Care Instructions</Label>
              <div className="space-y-2">
                {careInstructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={instruction}
                      onChange={(e) => {
                        const newInstructions = [...careInstructions];
                        newInstructions[index] = e.target.value;
                        setCareInstructions(newInstructions);
                        setFormData(prev => ({
                          ...prev,
                          quick_view_data: {
                            ...prev.quick_view_data,
                            care_instructions: newInstructions
                          }
                        }));
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        const newInstructions = careInstructions.filter((_, i) => i !== index);
                        setCareInstructions(newInstructions);
                        setFormData(prev => ({
                          ...prev,
                          quick_view_data: {
                            ...prev.quick_view_data,
                            care_instructions: newInstructions
                          }
                        }));
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newInstructions = [...careInstructions, ""];
                    setCareInstructions(newInstructions);
                    setFormData(prev => ({
                      ...prev,
                      quick_view_data: {
                        ...prev.quick_view_data,
                        care_instructions: newInstructions
                      }
                    }));
                  }}
                >
                  Add Care Instruction
                </Button>
              </div>
            </div>
            <div>
              <Label>Features</Label>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...features];
                        newFeatures[index] = e.target.value;
                        setFeatures(newFeatures);
                        setFormData(prev => ({
                          ...prev,
                          quick_view_data: {
                            ...prev.quick_view_data,
                            features: newFeatures
                          }
                        }));
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        const newFeatures = features.filter((_, i) => i !== index);
                        setFeatures(newFeatures);
                        setFormData(prev => ({
                          ...prev,
                          quick_view_data: {
                            ...prev.quick_view_data,
                            features: newFeatures
                          }
                        }));
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newFeatures = [...features, ""];
                    setFeatures(newFeatures);
                    setFormData(prev => ({
                      ...prev,
                      quick_view_data: {
                        ...prev.quick_view_data,
                        features: newFeatures
                      }
                    }));
                  }}
                >
                  Add Feature
                </Button>
              </div>
            </div>
          </div>

          {/* Key Highlights */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Key Highlights</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fit Type</Label>
                <Input
                  value={formData.key_highlights.fit_type}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    key_highlights: {
                      ...prev.key_highlights,
                      fit_type: e.target.value
                    }
                  }))}
                />
              </div>
              <div>
                <Label>Fabric</Label>
                <Input
                  value={formData.key_highlights.fabric}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    key_highlights: {
                      ...prev.key_highlights,
                      fabric: e.target.value
                    }
                  }))}
                />
              </div>
              <div>
                <Label>Neck</Label>
                <Input
                  value={formData.key_highlights.neck}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    key_highlights: {
                      ...prev.key_highlights,
                      neck: e.target.value
                    }
                  }))}
                />
              </div>
              <div>
                <Label>Sleeve</Label>
                <Input
                  value={formData.key_highlights.sleeve}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    key_highlights: {
                      ...prev.key_highlights,
                      sleeve: e.target.value
                    }
                  }))}
                />
              </div>
              <div>
                <Label>Pattern</Label>
                <Input
                  value={formData.key_highlights.pattern}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    key_highlights: {
                      ...prev.key_highlights,
                      pattern: e.target.value
                    }
                  }))}
                />
              </div>
              <div>
                <Label>Length</Label>
                <Input
                  value={formData.key_highlights.length}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    key_highlights: {
                      ...prev.key_highlights,
                      length: e.target.value
                    }
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Style & Categories */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Style & Categories</h2>
            <div>
              <Label>Style Category</Label>
              <Select
                value={formData.style_category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, style_category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {STYLE_CATEGORIES.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Status */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Product Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured Product</Label>
                <Switch
                  id="featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="bestseller">Best Seller</Label>
                <Switch
                  id="bestseller"
                  checked={formData.is_best_seller}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_best_seller: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="new-arrival">New Arrival</Label>
                <Switch
                  id="new-arrival"
                  checked={formData.is_new_arrival}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_new_arrival: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="trending">Trending</Label>
                <Switch
                  id="trending"
                  checked={formData.is_trending}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_trending: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};

export default ProductForm;