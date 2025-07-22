import { motion } from "framer-motion";
import { Printer, Palette, Users, Sparkles, Zap, Target, Clock, Shield } from "lucide-react";
import { Timeline } from "@/components/ui/Timeline";
import { AnimatedTestimonials } from "@/components/ui/AnimatedTestimonials";
import { SEO } from "@/components/SEO";

const About = () => {
  const timelineData = [
    {
      title: "2024",
      content: (
        <div>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base font-normal mb-8">
          Conceived in 2024, we started our journey step by step, and today, we proudly offer premium printing services with customized designs, top-quality prints, and unmatched craftsmanship.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src="/assets/img/Printing-IMG_1.jpg"
                alt="Modern Printing"
                className="object-cover h-20 md:h-44 lg:h-60 w-full transform hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src="/assets/img/Printing-IMG_2.jpg"
                alt="Digital Printing"
                className="object-cover h-20 md:h-44 lg:h-60 w-full transform hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
          </div>
        </div>
      ),
    },
    {
      title: "2023",
      content: (
        <div>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base font-normal mb-8">
          Conceived in 2023, we built our vision step by step—establishing a cutting-edge printing facility and assembling an expert design team to deliver top-tier custom printing solutions.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src="/assets/img/Heat-Press_Machine.jpg"
                alt="Our Team"
                className="object-cover h-20 md:h-44 lg:h-60 w-full transform hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src="/assets/img/DTF-Printer.jpg"
                alt="Our Facility"
                className="object-cover h-20 md:h-44 lg:h-60 w-full transform hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
          </div>
        </div>
      ),
    },
  ];

  // Members Testimonials
  const testimonials = [
    {
      quote: "The visionary behind CustomPrint, Aditya laid the foundation with a passion for quality and customization, driving innovation in the printing industry.",
      name: "Aditya Kumar Singh",
      designation: "Founder of Custom Print",
      src: "/assets/team/Aditya-Kumar-Singh.jpg"
    },
    {
      quote: "A strategic thinker and co-creator of CustomPrint, Keshav plays a key role in shaping the company’s growth and ensuring top-notch customer satisfaction.",
      name: "Keshav Yadav",
      designation: "Co-Founder of Custom Print",
      src: "/assets/team/Keshav-Yadav.jpg"
    },
    {
      quote: "Leading with expertise, Kartikeya oversees CustomPrint's operations, ensuring seamless execution and delivering premium custom printing solutions.  ",
      name: "Kartikeya Rai",
      designation: "CEO of Custom Print",
      src: "/assets/team/Kartikeya-Rai.jpg"
    },
    {
      quote: "Ankit drives business growth with strategic pricing and customer value while ensuring data security and compliance to protect customer information.",
      name: "Ankit Raj",
      designation: "CCO of Custom Print",
      src: "/assets/team/Ankit-Raj.jpg"
    },
    {
      quote: "A marketing expert, Haben drives brand visibility and customer engagement, crafting impactful campaigns that connect CustomPrint with its audience.",
      name: "Haben B",
      designation: "CMO of Custom Print",
      src: "/assets/team/Haben-B.jpeg"
    }
  ];


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const stats = [
    { number: "500+", label: "Happy Clients", icon: Users },
    { number: "1000+", label: "Design generated", icon: Target },
    { number: "24/7", label: "Customer Support", icon: Clock },
    { number: "100%", label: "Quality Assured", icon: Shield },
  ];

  const services = [
    {
      title: "Custom T-Shirt Printing",
      description: "Premium custom T-shirt printing with vibrant colors and long-lasting designs!",
      image: "/assets/img/T-shirts.jpg"
    },
    {
      title: "Custom Printed Bottles and Mugs",
      description: "Stylish custom Bottles and personalized Mugs with bold, vibrant prints that last!",
      image: "/assets/img/Mugs.jpg"
    },
    {
      title: "Custom designed pens",
      description: "Custom-designed pens that let you express your style with every stroke!",
      image: "/assets/img/Pens.jpg"
    }
  ];

  return (
    <>
      <SEO 
        title="About Custom Print - Leading Custom Clothing Printing Service in India"
        description="Custom Print is India's premier custom clothing printing service. With state-of-the-art printing technology, premium materials, and expert craftsmanship, we deliver high-quality custom printed apparel. Learn about our journey, values, and commitment to excellence."
        keywords={[
          'custom print company',
          'clothing printing service india',
          'about custom print',
          'custom apparel printing',
          'premium printing service',
          'custom clothing manufacturer',
          'printing technology india',
          'custom print history',
          'clothing customization experts',
          'professional printing service',
          'custom print values',
          'quality printing guarantee',
          'custom clothing company',
          'printing expertise india',
          'trusted printing service',
          'custom print mission'
        ]}
      />
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section with enhanced animation */}
        <section className="relative h-[80vh] overflow-hidden">
          <motion.div
            initial={{ scale: 1.2, filter: "brightness(0.8)" }}
            animate={{ scale: 1, filter: "brightness(1)" }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
          >
            <img
              src="https://images.unsplash.com/photo-1588412079929-790b9f593d8e?q=80&w=2070&auto=format&fit=crop"
              alt="Custom Printing"
            className="absolute inset-0 w-full h-full object-cover"
          />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80"></div>
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center px-4"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="w-24 h-24 bg-white/10 backdrop-blur-lg rounded-full mx-auto mb-8 flex items-center justify-center"
              >
                <Zap className="w-12 h-12 text-yellow-400" />
              </motion.div>
              <h1 className="text-5xl md:text-7xl text-white font-bold mb-6 font-serif tracking-tight">
                Custom Print
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto px-4 font-light leading-relaxed">
                Specializes in high-quality custom merchandise, including T-shirts, cups, pens, caps, and keychains, tailored to your unique designs. Bring your ideas to life with our affordable and personalized printing solutions!
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="mt-12"
              >
                <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-full text-lg hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 transform hover:-translate-y-1">
                  Explore Our Services
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
        <motion.div 
                key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">{stat.number}</h3>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with enhanced cards */}
      <section className="py-32 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group text-center p-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700/50"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                <Printer className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">Modern Technology</h3>
              <p className="text-gray-300 leading-relaxed">State-of-the-art printing equipment delivering exceptional results with precision and efficiency</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group text-center p-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700/50"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                <Palette className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-400 transition-colors">Custom Designs</h3>
              <p className="text-gray-300 leading-relaxed">Unique designs crafted to match your vision</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group text-center p-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700/50"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-green-400 transition-colors">Expert Team</h3>
              <p className="text-gray-300 leading-relaxed">Skilled professionals at your service</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group text-center p-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700/50"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                <Sparkles className="w-10 h-10 text-white" />
          </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-pink-400 transition-colors">Premium Quality</h3>
              <p className="text-gray-300 leading-relaxed">Uncompromising quality in every print</p>
            </motion.div>
        </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Explore our premium custom printing solutions, designed to bring your ideas to life!</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 z-10"></div>
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-[400px] object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-gray-300 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section with enhanced styling */}
      <section className="bg-gray-900">
        <Timeline data={timelineData} />
      </section>

      {/* Testimonials Section with enhanced styling */}
      <section className="bg-gray-900/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926')] opacity-20 mix-blend-overlay"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center px-4 relative z-10"
        >
          <h2 className="text-5xl md:text-6xl text-white font-bold mb-8 leading-tight">
            Ready to Transform Your Ideas?
          </h2>
          <p className="text-2xl text-gray-100 mb-12 font-light">
            Let's create something extraordinary together
          </p>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-12 py-5 rounded-full font-bold text-xl hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl"
          >
            Start Your Project with Custom Print
          </motion.button>
        </motion.div>
      </section>
    </div>
    </>
  );
};

export default About;