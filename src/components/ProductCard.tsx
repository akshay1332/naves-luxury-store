import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sale_percentage: number;
  is_new_arrival?: boolean;
  is_best_seller?: boolean;
  is_featured?: boolean;
  is_trending?: boolean;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const discountedPrice = product.sale_percentage
    ? product.price - (product.price * product.sale_percentage) / 100
    : product.price;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "group relative overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg",
        className
      )}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={product.title}
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.sale_percentage > 0 && (
              <Badge className="bg-red-500">
                {product.sale_percentage}% OFF
              </Badge>
            )}
            {product.is_new_arrival && (
              <Badge className="bg-blue-500">New Arrival</Badge>
            )}
            {product.is_best_seller && (
              <Badge className="bg-yellow-500">Best Seller</Badge>
            )}
            {product.is_trending && (
              <Badge className="bg-purple-500">Trending</Badge>
            )}
          </div>
          <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="mb-1 text-sm font-medium text-gray-700 line-clamp-1">
            {product.title}
          </h3>
          <p className="mb-2 text-xs text-gray-500 line-clamp-1">
            {product.category}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              ₹{discountedPrice.toLocaleString('en-IN')}
            </span>
            {product.sale_percentage > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}