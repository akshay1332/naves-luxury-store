import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ProductFormHeaderProps {
  title: string;
  onCancel: () => void;
}

export const ProductFormHeader = ({ title, onCancel }: ProductFormHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-serif">{title}</h2>
      <Button variant="outline" onClick={onCancel}>
        <X className="w-4 h-4 mr-2" />
        Cancel
      </Button>
    </div>
  );
};