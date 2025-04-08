
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadProps {
  form: any;
  initialData?: {
    images?: string[];
  };
}

export const ImageUpload = ({ form, initialData }: ImageUploadProps) => {
  const { toast } = useToast();
  const [imageLink, setImageLink] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const MAX_IMAGES = 10;

  // Safely get current images array
  const currentImages = form.watch('images') || [];

  const handleAddImageLink = () => {
    if (!imageLink) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an image URL",
      });
      return;
    }

    if (currentImages.length >= MAX_IMAGES) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Maximum ${MAX_IMAGES} images allowed`,
      });
      return;
    }

    // Create a new Image object to verify the URL
    const img = new Image();
    img.onload = () => {
      form.setValue('images', [...currentImages, imageLink]);
      setImageLink("");
      toast({
        title: "Success",
        description: "Image link added successfully",
      });
    };
    img.onerror = () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid image URL or image not accessible",
      });
    };
    img.src = imageLink;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (currentImages.length + files.length > MAX_IMAGES) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Maximum ${MAX_IMAGES} images allowed. You can upload ${MAX_IMAGES - currentImages.length} more.`,
      });
      return;
    }

    setUploading(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Generate a unique file name to prevent overwriting
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError, data } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedImageUrls = await Promise.all(uploadPromises);
      form.setValue('images', [...currentImages, ...uploadedImageUrls]);

      toast({
        title: "Success",
        description: `${uploadPromises.length} image(s) uploaded successfully`,
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Failed to upload image(s)",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = currentImages.filter((_, i) => i !== index);
    form.setValue('images', updatedImages);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-6 space-y-6 border-black">
      <h3 className="text-lg font-semibold text-black">Product Images</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {currentImages.map((url: string, index: number) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg border border-black"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* File upload section */}
        <div className="space-y-2">
          <Label htmlFor="imageUpload" className="text-black">Upload Images</Label>
          <input
            type="file"
            id="imageUpload"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
          />
          
          <div className="flex gap-2">
            <Button
              onClick={triggerFileInput}
              disabled={uploading || currentImages.length >= MAX_IMAGES}
              type="button"
              variant="outline"
              className="w-full border-dashed border-2 py-6 flex flex-col items-center justify-center"
            >
              <Upload className="h-5 w-5 mb-2" />
              {uploading ? 'Uploading...' : 'Click to upload images'}
              <p className="text-xs text-gray-500 mt-1">
                (PNG, JPG, WEBP up to 5MB)
              </p>
            </Button>
          </div>
        </div>

        {/* Image URL section */}
        <div className="space-y-2">
          <Label htmlFor="imageLink" className="text-black">Or Add Image URL</Label>
          <div className="flex gap-2">
            <Input
              id="imageLink"
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
              placeholder="Enter image URL"
              className="border-black text-black"
            />
            <Button 
              onClick={handleAddImageLink}
              disabled={currentImages.length >= MAX_IMAGES}
              type="button"
            >
              Add
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            {`${currentImages.length}/${MAX_IMAGES} images uploaded`}
          </p>
        </div>
      </div>
    </Card>
  );
};
