import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { formatIndianPrice } from '../../utils/formatters';

const ProductCard = ({ product }) => {
  return (
    <Link 
      to={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg"
    >
      {/* Image Container */}
      <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0]}
          alt={product.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Rating Badge */}
        {product.rating && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-white px-1.5 py-0.5 text-xs font-medium">
            <span>{product.rating}</span>
            <Star className="h-3 w-3 fill-current text-yellow-400" />
            <span className="text-gray-500">({product.reviews_count})</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_new_arrival && (
            <span className="bg-green-500 text-white px-2 py-0.5 text-xs font-medium rounded">
              NEW
            </span>
          )}
          {product.sale_percentage > 0 && (
            <span className="bg-red-500 text-white px-2 py-0.5 text-xs font-medium rounded">
              {product.sale_percentage}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand/Title */}
        <h3 className="font-medium text-gray-900 line-clamp-1">
          {product.title}
        </h3>
        
        {/* Category */}
        <p className="mt-1 text-sm text-gray-500 line-clamp-1">
          {product.category}
        </p>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="font-medium text-gray-900">
            {formatIndianPrice(product.price)}
          </span>
          {product.sale_percentage > 0 && (
            <>
              <span className="text-sm text-gray-500 line-through">
                {formatIndianPrice(Math.round(product.price / (1 - product.sale_percentage / 100)))}
              </span>
              <span className="text-sm text-green-600 font-medium">
                {product.sale_percentage}% off
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 