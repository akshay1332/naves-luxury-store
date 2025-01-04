import { Input } from "@/components/ui/input";

interface VariantsProps {
  initialData?: {
    sizes: string[];
    colors: string[];
  };
}

export const Variants = ({ initialData }: VariantsProps) => {
  return (
    <>
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
    </>
  );
};