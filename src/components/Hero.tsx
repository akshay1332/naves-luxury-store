import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useRef } from "react";

const Hero = () => {
  const { theme: currentTheme } = useTheme();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <div ref={ref} className="relative min-h-screen overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2072"
          alt="Custom Print - Premium Custom Clothing"
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-screen px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          <motion.div
            variants={itemVariants}
            className="mb-4 inline-block"
          >
            <span className="px-4 py-2 bg-rose-500 text-white rounded-full text-sm font-semibold">
              Premium Custom Printing
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className={cn(
              "text-4xl md:text-5xl lg:text-7xl font-bold font-montserrat tracking-tight mb-6",
              "text-white leading-tight"
            )}
          >
            Bring Your <span className="text-rose-500">Creative Vision</span> To Life
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-200 mb-4 font-montserrat"
          >
            Transform your ideas into stunning custom apparel
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg"
          >
            From unique t-shirts to premium hoodies, we bring your designs to life with 
            expert craftsmanship and attention to detail.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4"
          >
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                to="/products"
                className={cn(
                  "inline-flex items-center justify-center px-8 py-4 rounded-lg",
                  "text-lg font-semibold text-white bg-rose-500 hover:bg-rose-600",
                  "transition-colors duration-300 shadow-lg hover:shadow-xl"
                )}
              >
                Explore Collection
              </Link>
            </motion.div>

            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                to="/contact"
                className={cn(
                  "inline-flex items-center justify-center px-8 py-4 rounded-lg",
                  "text-lg font-semibold text-white border-2 border-white hover:bg-white/10",
                  "transition-colors duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                )}
              >
                Get Started
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-12 flex items-center gap-8"
          >
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white">500+</span>
              <span className="text-gray-300">Happy Clients</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white">1000+</span>
              <span className="text-gray-300">Designs Created</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white">100%</span>
              <span className="text-gray-300">Satisfaction</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 bg-white rounded-full mt-2"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero; 