import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface ImageUploadProps {
  imageUrls: string[];
  onImageAdd: (url: string) => void;
  onImageRemove: (index: number) => void;
}

export const ImageUpload = ({ imageUrls, onImageAdd, onImageRemove }: ImageUploadProps) => {
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleAddImage = () => {
    if (newImageUrl) {
      onImageAdd(newImageUrl);
      setNewImageUrl("");
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Images</label>
      <div className="flex gap-2">
        <Input
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="Enter image URL"
          className="luxury-input"
        />
        <Button 
          type="button" 
          onClick={handleAddImage}
          className="bg-luxury-gold hover:bg-luxury-gold/90"
        >
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
  );
};