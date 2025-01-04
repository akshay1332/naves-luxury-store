import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { convertToINR } from "@/utils/currency";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  images: string[];
  category?: string;
}

const ProductCard = ({ id, title, price, images, category }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Link to={`/products/${id}`} className="block group">
        <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-square">
          <motion.img
            src={images?.[0] || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"}
            alt={title}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
          />
          {category && (
            <div className="absolute top-4 left-4">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-luxury-gold/90 px-3 py-1 text-xs text-white rounded-full shadow-lg"
              >
                {category}
              </motion.span>
            </div>
          )}
        </div>
        <div className="p-4">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-serif text-lg mb-2 group-hover:text-primary transition-colors"
          >
            {title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-semibold text-gray-900"
          >
            {convertToINR(price)}
          </motion.p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;