import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FeaturesProps {
  initialData?: {
    is_featured: boolean;
    is_best_seller: boolean;
  };
}

export const Features = ({ initialData }: FeaturesProps) => {
  return (
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
  );
};