import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { convertToINR } from "@/utils/currency";
import { Percent } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  images: string[];
  category?: string;
  sale_percentage?: number;
  sale_start_date?: string;
  sale_end_date?: string;
  video_url?: string;
}

const ProductCard = ({ 
  id, 
  title, 
  price, 
  images, 
  category,
  sale_percentage,
  sale_start_date,
  sale_end_date,
  video_url 
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isSaleActive = sale_percentage && sale_start_date && sale_end_date && 
    new Date(sale_start_date) <= new Date() && new Date(sale_end_date) >= new Date();

  const discountedPrice = isSaleActive ? 
    price - (price * (sale_percentage / 100)) : price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Link 
        to={`/products/${id}`} 
        className="block group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-square">
          {video_url && isHovered ? (
            <video
              src={video_url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <motion.img
              src={images?.[0] || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"}
              alt={title}
              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
            />
          )}
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
          {isSaleActive && (
            <div className="absolute top-4 right-4">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500 text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
              >
                <Percent className="w-3 h-3" />
                <span className="text-xs font-bold">{sale_percentage}% OFF</span>
              </motion.div>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <span className={`text-lg font-semibold ${isSaleActive ? 'text-red-500' : 'text-gray-900'}`}>
              {convertToINR(discountedPrice)}
            </span>
            {isSaleActive && (
              <span className="text-sm text-gray-500 line-through">
                {convertToINR(price)}
              </span>
            )}
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;