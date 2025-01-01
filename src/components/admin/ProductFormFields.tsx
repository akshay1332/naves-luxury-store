import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, X } from "lucide-react";

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
        <div className="flex gap-2">
          <Input
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Enter image URL"
          />
          <Button type="button" onClick={handleAddImage}>
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