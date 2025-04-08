import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  form: any;
  initialData?: {
    images?: string[];
  };
}

export const ImageUpload = ({ form, initialData }: ImageUploadProps) => {
  const { toast } = useToast();
  const [imageLink, setImageLink] = React.useState("");
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

  const handleRemoveImage = (index: number) => {
    const updatedImages = currentImages.filter((_, i) => i !== index);
    form.setValue('images', updatedImages);
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

        <div className="space-y-2">
          <Label htmlFor="imageLink" className="text-black">Add Image URL</Label>
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