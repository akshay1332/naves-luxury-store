import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"
          alt="Traditional Fashion"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl text-white font-serif"
          >
            Our Story
          </motion.h1>
        </div>
      </section>

      {/* Content Sections */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl font-serif mb-6 text-luxury-gold">Heritage & Tradition</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Label Naves was founded with a vision to preserve and celebrate the rich heritage of traditional fashion while embracing modern sensibilities. Our journey began with a deep appreciation for artisanal craftsmanship and timeless designs.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Each piece in our collection tells a story of cultural richness, artistic excellence, and sustainable fashion practices that honor both tradition and innovation.
            </p>
          </div>
          <div className="relative h-[400px] overflow-hidden rounded-lg shadow-xl">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070"
              alt="Artisanal Craftsmanship"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="bg-gradient-to-r from-secondary-dark to-secondary py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-3 gap-8"
          >
            <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-lg">
              <h3 className="text-2xl font-serif mb-4 text-luxury-gold">Craftsmanship</h3>
              <p className="text-gray-300">Dedicated to preserving traditional techniques while embracing modern innovation.</p>
            </div>
            <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-lg">
              <h3 className="text-2xl font-serif mb-4 text-luxury-gold">Sustainability</h3>
              <p className="text-gray-300">Committed to ethical practices and environmental responsibility in fashion.</p>
            </div>
            <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-lg">
              <h3 className="text-2xl font-serif mb-4 text-luxury-gold">Heritage</h3>
              <p className="text-gray-300">Celebrating cultural richness through timeless designs and authentic expression.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;