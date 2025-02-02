import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PRODUCT_CATEGORIES = [
  "Dresses",
  "Tops",
  "Bottoms",
  "Outerwear",
  "Accessories",
  "Footwear",
  "Other"
];

const STYLE_CATEGORIES = [
  "Casual",
  "Formal",
  "Sports",
  "Ethnic",
  "Party",
  "Beach",
  "Business"
];

const GENDER_OPTIONS = ["men", "women", "unisex"];

interface BasicDetailsProps {
  initialData?: {
    title: string;
    description: string;
    category: string;
    gender: string;
    style_category?: string;
    video_url?: string;
  };
}

export const BasicDetails = ({ initialData }: BasicDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          name="title"
          defaultValue={initialData?.title}
          required
          className="luxury-input"
          placeholder="Enter product title"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
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
          <label className="text-sm font-medium">Style</label>
          <Select name="style_category" defaultValue={initialData?.style_category}>
            <SelectTrigger className="luxury-input">
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
        <label className="text-sm font-medium">Video URL</label>
        <Input
          name="video_url"
          defaultValue={initialData?.video_url}
          className="luxury-input"
          placeholder="Enter product video URL"
          type="url"
        />
        <p className="text-sm text-gray-500">Add a video URL to show on hover (optional)</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          name="description"
          defaultValue={initialData?.description}
          required
          className="luxury-input min-h-[100px]"
          placeholder="Enter product description"
        />
      </div>
    </div>
  );
};