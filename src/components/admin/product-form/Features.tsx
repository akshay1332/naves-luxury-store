import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Percent } from "lucide-react";

interface FeaturesProps {
  initialData?: {
    is_featured: boolean;
    is_best_seller: boolean;
    is_new_arrival?: boolean;
    is_trending?: boolean;
    sale_percentage?: number;
    sale_start_date?: string;
    sale_end_date?: string;
  };
}

export const Features = ({ initialData }: FeaturesProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_featured"
            name="is_featured"
            defaultChecked={initialData?.is_featured}
          />
          <Label htmlFor="is_featured">Featured Product</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_best_seller"
            name="is_best_seller"
            defaultChecked={initialData?.is_best_seller}
          />
          <Label htmlFor="is_best_seller">Best Seller</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_new_arrival"
            name="is_new_arrival"
            defaultChecked={initialData?.is_new_arrival}
          />
          <Label htmlFor="is_new_arrival">New Arrival</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_trending"
            name="is_trending"
            defaultChecked={initialData?.is_trending}
          />
          <Label htmlFor="is_trending">Trending</Label>
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <h4 className="text-sm font-medium mb-4">Sale Settings</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sale_percentage">Sale Discount (%)</Label>
            <div className="relative">
              <Percent className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="sale_percentage"
                name="sale_percentage"
                type="number"
                min="0"
                max="100"
                defaultValue={initialData?.sale_percentage}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sale_start_date">Sale Start Date</Label>
            <Input
              id="sale_start_date"
              name="sale_start_date"
              type="datetime-local"
              defaultValue={initialData?.sale_start_date}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sale_end_date">Sale End Date</Label>
            <Input
              id="sale_end_date"
              name="sale_end_date"
              type="datetime-local"
              defaultValue={initialData?.sale_end_date}
            />
          </div>
        </div>
      </div>
    </div>
  );
};