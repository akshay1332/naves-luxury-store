import { BasicDetails } from "./product-form/BasicDetails";
import { PricingStock } from "./product-form/PricingStock";
import { Variants } from "./product-form/Variants";
import { Features } from "./product-form/Features";
import { ImageUpload } from "./product-form/ImageUpload";

interface ProductFormFieldsProps {
  initialData?: {
    title: string;
    description: string;
    price: number;
    sizes: string[];
    colors: string[];
    images: string[];
    stock_quantity: number;
    is_featured: boolean;
    is_best_seller: boolean;
    category: string;
    gender: string;
  };
  loading: boolean;
  onImageAdd: (url: string) => void;
  onImageRemove: (index: number) => void;
  imageUrls: string[];
}

export const ProductFormFields = ({
  initialData,
  loading,
  onImageAdd,
  onImageRemove,
  imageUrls,
}: ProductFormFieldsProps) => {
  return (
    <div className="space-y-6">
      <BasicDetails initialData={initialData} />
      <PricingStock initialData={initialData} />
      <Variants initialData={initialData} />
      <Features initialData={initialData} />
      <ImageUpload
        imageUrls={imageUrls}
        onImageAdd={onImageAdd}
        onImageRemove={onImageRemove}
      />
    </div>
  );
};

export default ProductFormFields;