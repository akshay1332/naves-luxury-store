import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface ProductFormActionsProps {
  loading: boolean;
  isEditing: boolean;
}

export const ProductFormActions = ({ loading, isEditing }: ProductFormActionsProps) => {
  return (
    <div className="flex justify-end gap-4">
      <Button 
        type="submit" 
        disabled={loading}
        className="bg-luxury-gold hover:bg-luxury-gold/90"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Save className="w-4 h-4 mr-2" />
        )}
        {isEditing ? 'Update Product' : 'Create Product'}
      </Button>
    </div>
  );
};