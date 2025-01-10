import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductMediaGalleryProps {
  images: string[];
  title: string;
  video_url?: string;
}

const ProductMediaGallery = ({ images, title, video_url }: ProductMediaGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  const nextMedia = () => {
    if (showVideo) {
      setShowVideo(false);
      setCurrentIndex(0);
    } else {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevMedia = () => {
    if (showVideo) {
      setShowVideo(false);
      setCurrentIndex(images.length - 1);
    } else {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className="relative aspect-square rounded-xl overflow-hidden bg-luxury-pearl/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          {(showVideo || (isHovered && video_url && !isMobile)) ? (
            <motion.video
              key="video"
              src={video_url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          ) : (
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`${title} - ${currentIndex + 1}`}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
        
        <button
          onClick={prevMedia}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={nextMedia}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => {
              setShowVideo(false);
              setCurrentIndex(index);
            }}
            className={`relative aspect-square rounded-lg overflow-hidden ${
              !showVideo && currentIndex === index ? 'ring-2 ring-luxury-gold' : ''
            }`}
          >
            <img
              src={image}
              alt={`${title} thumbnail ${index + 1}`}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </button>
        ))}
        {video_url && (
          <button
            onClick={() => setShowVideo(true)}
            className={`relative aspect-square rounded-lg overflow-hidden ${
              showVideo ? 'ring-2 ring-luxury-gold' : ''
            }`}
          >
            <video
              src={video_url}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                <Play className="w-6 h-6 text-luxury-gold ml-1" />
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductMediaGallery;