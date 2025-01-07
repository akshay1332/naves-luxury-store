import { motion } from "framer-motion";
import { convertToINR } from "@/utils/currency";
import { Badge } from "@/components/ui/badge";
import { Crown, Star } from "lucide-react";

interface ProductHeaderProps {
  title: string;
  price: number;
  category?: string;
  rating?: number;
}

const ProductHeader = ({ title, price, category, rating }: ProductHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {category && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <Badge variant="outline" className="bg-luxury-gold/10 text-luxury-gold border-luxury-gold/20 px-4 py-1">
            <Crown className="w-4 h-4 mr-1" />
            {category}
          </Badge>
          {rating && (
            <div className="flex items-center text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="ml-1 text-sm font-medium">{rating}</span>
            </div>
          )}
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
        className="flex items-center gap-4"
      >
        <span className="text-3xl font-semibold bg-gradient-to-r from-luxury-gold to-luxury-silver bg-clip-text text-transparent">
          {convertToINR(price)}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default ProductHeader;