import React from 'react';
import { Link } from "react-router-dom";
import { ChevronLeft, Heart } from "lucide-react";
import { motion } from "framer-motion";

interface ProductContainerProps {
  id: string;
  isWishlist: boolean;
  setIsWishlist: (value: boolean) => void;
  children: React.ReactNode;
}

const ProductContainer = ({ id, isWishlist, setIsWishlist, children }: ProductContainerProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-8 flex justify-between items-center"
      >
        <Link 
          to="/products"
          className="inline-flex items-center text-luxury-gold hover:text-luxury-gold/80 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Products
        </Link>
        <button
          onClick={() => setIsWishlist(!isWishlist)}
          className="p-2 rounded-full hover:bg-luxury-pearl/20 transition-colors"
        >
          <Heart 
            className={`w-6 h-6 transition-colors ${
              isWishlist ? 'fill-luxury-gold text-luxury-gold' : 'text-gray-400'
            }`}
          />
        </button>
      </motion.div>
      {children}
    </div>
  );
};

export default ProductContainer;