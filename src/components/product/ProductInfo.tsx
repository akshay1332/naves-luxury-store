import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart } from "lucide-react";

interface ProductInfoProps {
  title: string;
  price: number;
  description: string;
  sizes: string[];
  colors: string[];
  stock_quantity: number;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  setSelectedSize: (size: string) => void;
  setSelectedColor: (color: string) => void;
  setQuantity: (quantity: number) => void;
  onAddToCart: () => void;
}

const ProductInfo = ({
  title,
  price,
  description,
  sizes,
  colors,
  stock_quantity,
  selectedSize,
  selectedColor,
  quantity,
  setSelectedSize,
  setSelectedColor,
  setQuantity,
  onAddToCart,
}: ProductInfoProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-3xl font-semibold text-primary">${price}</p>
      </div>

      <p className="text-gray-600 leading-relaxed">{description}</p>

      {sizes && sizes.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Size</label>
          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {colors && colors.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Color</label>
          <Select value={selectedColor} onValueChange={setSelectedColor}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              {colors.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Quantity</label>
        <Select
          value={quantity.toString()}
          onValueChange={(value) => setQuantity(parseInt(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[...Array(10)].map((_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        className="w-full h-12 text-lg"
        onClick={onAddToCart}
        disabled={stock_quantity < 1}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {stock_quantity < 1 ? "Out of Stock" : "Add to Cart"}
      </Button>

      {stock_quantity > 0 && stock_quantity < 5 && (
        <p className="text-red-500 text-sm text-center">
          Only {stock_quantity} items left in stock!
        </p>
      )}
    </div>
  );
};

export default ProductInfo;