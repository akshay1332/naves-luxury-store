import React from 'react';

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

const ProductImageGallery = ({ images, title }: ProductImageGalleryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {images?.map((image, index) => (
        <div 
          key={index}
          className={`relative overflow-hidden rounded-lg ${index === 0 ? 'md:col-span-2' : ''}`}
        >
          <img
            src={image || '/placeholder.svg'}
            alt={`${title} - ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
};

export default ProductImageGallery;