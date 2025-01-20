import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { MarqueeAnimation } from "@/components/ui/marquee-effect";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      <motion.div 
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
        <div className="relative h-full w-full">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"
            alt="Luxury Fashion"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
        </div>
      </motion.div>
      
      <LampContainer className="pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-serif font-light mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Zariya
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            For every chapter of your journey
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/products"
              className="inline-block bg-luxury-gold hover:bg-luxury-gold/90 text-white px-8 py-3 rounded-md transition-all duration-300 transform hover:shadow-2xl"
            >
              Explore Collection
            </Link>
          </motion.div>
        </motion.div>
      </LampContainer>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <MarqueeAnimation
          direction="left"
          baseVelocity={-2}
          className="bg-gradient-to-r from-luxury-gold/20 to-luxury-pearl/20 text-luxury-gold py-4 font-serif"
        >
          Luxury Fashion • Timeless Elegance • Exclusive Collection
        </MarqueeAnimation>
        <MarqueeAnimation
          direction="right"
          baseVelocity={-2}
          className="bg-gradient-to-r from-luxury-pearl/20 to-luxury-gold/20 text-luxury-champagne py-4 font-serif"
        >
          Premium Quality • Handcrafted Excellence • Bespoke Design
        </MarqueeAnimation>
      </div>
    </section>
  );
};

export default HeroSection;