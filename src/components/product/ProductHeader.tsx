import { motion } from "framer-motion";
import { convertToINR } from "@/utils/currency";

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
      className="mb-8"
    >
      {category && (
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-block bg-luxury-gold/10 text-luxury-gold px-3 py-1 rounded-full text-sm mb-2"
        >
          {category}
        </motion.span>
      )}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl font-serif font-bold text-gray-900 mb-4"
      >
        {title}
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-semibold text-primary"
      >
        {convertToINR(price)}
      </motion.div>
    </motion.div>
  );
};

export default ProductHeader;