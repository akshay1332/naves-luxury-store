import { motion } from "framer-motion";
import { convertToINR } from "@/utils/currency";
import { Badge } from "@/components/ui/badge";

interface ProductHeaderProps {
  title: string;
  price: number;
  category?: string;
}

const ProductHeader = ({ title, price, category }: ProductHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {category && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Badge variant="outline" className="bg-luxury-gold/10 text-luxury-gold border-luxury-gold/20">
            {category}
          </Badge>
        </motion.div>
      )}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight"
      >
        {title}
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-semibold text-luxury-gold"
      >
        {convertToINR(price)}
      </motion.div>
    </motion.div>
  );
};

export default ProductHeader;