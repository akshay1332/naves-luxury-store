import { BasicDetails } from "./product-form/BasicDetails";
import { PricingStock } from "./product-form/PricingStock";
import { Variants } from "./product-form/Variants";
import { Features } from "./product-form/Features";
import { ImageUpload } from "./product-form/ImageUpload";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

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
    is_new_arrival?: boolean;
    is_trending?: boolean;
    style_category?: string;
  };
  loading: boolean;
  onImageAdd: (url: string) => void;
  onImageRemove: (index: number) => void;
  imageUrls: string[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const ProductFormFields = ({
  initialData,
  loading,
  onImageAdd,
  onImageRemove,
  imageUrls,
}: ProductFormFieldsProps) => {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item}>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Basic Details</h3>
          <BasicDetails initialData={initialData} />
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Pricing & Stock</h3>
          <PricingStock initialData={initialData} />
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Variants</h3>
          <Variants initialData={initialData} />
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Features</h3>
          <Features initialData={initialData} />
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Images</h3>
          <ImageUpload
            imageUrls={imageUrls}
            onImageAdd={onImageAdd}
            onImageRemove={onImageRemove}
          />
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ProductFormFields;