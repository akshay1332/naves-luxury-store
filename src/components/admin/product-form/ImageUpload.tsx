import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="Enter image URL"
          className="luxury-input flex-1"
        />
        <Button 
          type="button" 
          onClick={handleAddImage}
          className="bg-luxury-gold hover:bg-luxury-gold/90"
          disabled={!newImageUrl}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <AnimatePresence>
        {imageUrls.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-gray-400"
          >
            <ImageIcon className="w-12 h-12 mb-2" />
            <p>No images added yet</p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            layout
          >
            {imageUrls.map((url, index) => (
              <motion.div
                key={url}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group"
              >
                <img
                  src={url}
                  alt={`Product ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <motion.button
                  type="button"
                  onClick={() => onImageRemove(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};