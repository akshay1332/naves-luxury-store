import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const PRODUCT_CATEGORIES = [
  "Dresses",
  "Tops",
  "Bottoms",
  "Outerwear",
  "Accessories",
  "Footwear",
  "Other"
];

const GENDER_OPTIONS = ["men", "women", "unisex"];

interface ProductFormFieldsProps {
  initialData?: {
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
  loading: boolean;
  onImageAdd: (url: string) => void;
  onImageRemove: (index: number) => void;
  imageUrls: string[];
}

export const ProductFormFields = ({
  initialData,
  loading,
  onImageAdd,
  onImageRemove,
  imageUrls,
}: ProductFormFieldsProps) => {
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleAddImage = () => {
    if (newImageUrl) {
      onImageAdd(newImageUrl);
      setNewImageUrl("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          name="title"
          defaultValue={initialData?.title}
          required
          className="luxury-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select name="category" defaultValue={initialData?.category}>
            <SelectTrigger className="luxury-input">
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Gender</label>
          <Select name="gender" defaultValue={initialData?.gender || 'unisex'}>
            <SelectTrigger className="luxury-input">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((gender) => (
                <SelectItem key={gender} value={gender}>
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          name="description"
          defaultValue={initialData?.description}
          required
          className="luxury-input min-h-[100px]"
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
            className="luxury-input"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Stock Quantity</label>
          <Input
            name="stock_quantity"
            type="number"
            defaultValue={initialData?.stock_quantity}
            required
            className="luxury-input"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Sizes (comma-separated)</label>
        <Input
          name="sizes"
          defaultValue={initialData?.sizes?.join(', ')}
          placeholder="S, M, L, XL"
          className="luxury-input"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Colors (comma-separated)</label>
        <Input
          name="colors"
          defaultValue={initialData?.colors?.join(', ')}
          placeholder="Red, Blue, Green"
          className="luxury-input"
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            name="is_featured"
            id="is_featured"
            defaultChecked={initialData?.is_featured}
          />
          <Label htmlFor="is_featured">Featured Product</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            name="is_best_seller"
            id="is_best_seller"
            defaultChecked={initialData?.is_best_seller}
          />
          <Label htmlFor="is_best_seller">Best Seller</Label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Images</label>
        <div className="flex gap-2">
          <Input
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="luxury-input"
          />
          <Button type="button" onClick={handleAddImage} className="bg-luxury-gold hover:bg-luxury-gold/90">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {imageUrls.map((url, index) => (
            <div key={url} className="relative">
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onImageRemove(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFormFields;