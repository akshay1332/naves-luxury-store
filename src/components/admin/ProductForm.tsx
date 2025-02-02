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

const ProductForm = ({ initialData, onSuccess }: ProductFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>(initialData?.colors || []);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialData?.sizes || []);
  const [careInstructions, setCareInstructions] = useState<string[]>(
    initialData?.quick_view_data?.care_instructions || []
  );
  const [features, setFeatures] = useState<string[]>(
    initialData?.quick_view_data?.features || []
  );

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    category: initialData?.category || "",
    gender: initialData?.gender || "",
    stock_quantity: initialData?.stock_quantity || 0,
    is_featured: initialData?.is_featured || false,
    is_best_seller: initialData?.is_best_seller || false,
    is_new_arrival: initialData?.is_new_arrival || false,
    is_trending: initialData?.is_trending || false,
    video_url: initialData?.video_url || "",
    style_category: initialData?.style_category || "",
    quick_view_data: {
      material: initialData?.quick_view_data?.material || "",
      fit: initialData?.quick_view_data?.fit || "",
      care_instructions: careInstructions,
      features: features,
    },
    key_highlights: {
      fit_type: initialData?.key_highlights?.fit_type || "",
      fabric: initialData?.key_highlights?.fabric || "",
      neck: initialData?.key_highlights?.neck || "",
      sleeve: initialData?.key_highlights?.sleeve || "",
      pattern: initialData?.key_highlights?.pattern || "",
      length: initialData?.key_highlights?.length || "",
    },
    sizes: selectedSizes,
    colors: selectedColors,
    images: initialData?.images || [],
  });

  const [imageLink, setImageLink] = useState("");

  const handleAddImageLink = () => {
    if (imageLink && formData.images.length < 10) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageLink]
      }));
      setImageLink("");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Maximum 10 images allowed or invalid image URL",
      });
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
        quick_view_data: {
          ...formData.quick_view_data,
          care_instructions: careInstructions,
          features,
        },
      };

      if (initialData) {
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
            
            {/* Image Preview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formData.images.map((url, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
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
          </div>

          {/* Rest of the form */}
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
