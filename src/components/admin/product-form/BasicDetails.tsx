import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BasicDetailsProps {
  initialData?: {
    title: string;
    description: string;
    category: string;
    gender: string;
    style_category: string;
    size_chart_image?: string;
  };
  form: any;
}

const GENDERS = ["men", "women", "unisex"] as const;

export const BasicDetails = ({ initialData, form }: BasicDetailsProps) => {
  return (
    <Card className="p-6 space-y-6 border-black">
      <h3 className="text-lg font-semibold text-black">Basic Details</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-black">Title</Label>
          <Input
            id="title"
            {...form.register("title", { required: "Title is required" })}
            className="border-black text-black"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-black">Description</Label>
          <Textarea
            id="description"
            {...form.register("description", { required: "Description is required" })}
            className="border-black text-black min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-black">Category</Label>
            <Input
              id="category"
              {...form.register("category", { required: "Category is required" })}
              placeholder="Enter product category"
              className="border-black text-black"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-black">Gender</Label>
            <Select
              defaultValue={initialData?.gender}
              onValueChange={(value) => form.setValue("gender", value)}
            >
              <SelectTrigger className="border-black text-black">
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

          <div className="space-y-2">
            <Label htmlFor="style_category" className="text-black">Style Category</Label>
            <Input
              id="style_category"
              {...form.register("style_category", { required: "Style category is required" })}
              placeholder="Enter style category"
              className="border-black text-black"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="size_chart_image" className="text-black">Size Chart Image URL</Label>
          <Input
            id="size_chart_image"
            {...form.register("size_chart_image")}
            placeholder="Enter size chart image URL"
            className="border-black text-black"
          />
          <p className="text-sm text-gray-500">Add a URL for the product's size chart image</p>
        </div>
      </div>
    </Card>
  );
};