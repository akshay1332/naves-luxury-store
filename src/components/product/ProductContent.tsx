import React from 'react';
import { motion } from "framer-motion";
import ProductMediaGallery from "./ProductMediaGallery";
import ProductInfo from "./ProductInfo";
import ProductHeader from "./ProductHeader";

interface ProductContentProps {
  product: any;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  setSelectedSize: (size: string) => void;
  setSelectedColor: (color: string) => void;
  setQuantity: (quantity: number) => void;
  onAddToCart: () => void;
}

export const ProductContent = ({
  product,
  selectedSize,
  selectedColor,
  quantity,
  setSelectedSize,
  setSelectedColor,
  setQuantity,
  onAddToCart
}: ProductContentProps) => {
  return (
    <div className="grid lg:grid-cols-2 gap-6 md:gap-12">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="sticky top-24 h-fit"
      >
        <ProductMediaGallery 
          images={product.images} 
          title={product.title} 
          video_url={product.video_url}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-8 bg-white/50 backdrop-blur-sm rounded-xl p-4 md:p-8 h-fit"
      >
        <ProductHeader
          title={product.title}
          price={product.price}
          category={product.category}
        />
        <ProductInfo
          {...product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          quantity={quantity}
          setSelectedSize={setSelectedSize}
          setSelectedColor={setSelectedColor}
          setQuantity={setQuantity}
          onAddToCart={onAddToCart}
        />
      </motion.div>
    </div>
  );
};
