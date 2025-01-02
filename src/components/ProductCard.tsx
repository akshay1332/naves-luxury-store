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
    >
      <Link to={`/products/${id}`} className="product-card block">
        <div className="relative overflow-hidden aspect-square">
          <img
            src={images?.[0] || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"}
            alt={title}
            className="product-card-image"
          />
          {category && (
            <div className="absolute top-4 left-4">
              <span className="bg-luxury-gold/90 px-3 py-1 text-xs text-white rounded-full">
                {category}
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-serif text-lg mb-2">{title}</h3>
          <p className="price-inr">{convertToINR(price)}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;