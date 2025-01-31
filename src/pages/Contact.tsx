import { motion } from "framer-motion";
import { ContactForm } from "@/components/contact/ContactForm";
import { SEO } from "@/components/SEO";

const Contact = () => {
  return (
    <>
      <SEO 
        title="Contact Custom Print - Get Custom Clothing Printing Services | Customer Support"
        description="Contact Custom Print for premium custom clothing printing services in India. Get expert assistance for bulk orders, custom designs, and printing solutions. Reach our customer support for queries about custom hoodies, t-shirts, and apparel printing."
        keywords={[
          'contact custom print',
          'custom print support',
          'clothing printing contact',
          'custom print india contact',
          'bulk order inquiry',
          'custom design consultation',
          'printing service support',
          'custom clothing help',
          'custom print location',
          'printing service contact',
          'custom apparel support',
          'business hours custom print',
          'custom print phone number',
          'custom print email',
          'printing service inquiry',
          'custom clothing consultation'
        ]}
      />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[40vh] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070"
            alt="Contact Us"
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
              Contact Us
            </motion.h1>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-secondary-dark text-white p-8 rounded-lg"
            >
              <h2 className="text-3xl font-serif mb-6 text-luxury-gold">Get in Touch</h2>
              <p className="text-gray-300 mb-8">
                We'd love to hear from you. Please fill out the form below and we'll get back to you as soon as possible.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif mb-2 text-luxury-gold">Visit Our Store</h3>
                  <p className="text-gray-300">123 Fashion Street</p>
                  <p className="text-gray-300">New Delhi, India</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-serif mb-2 text-luxury-gold">Contact Information</h3>
                  <p className="text-gray-300">Email: info@labelnaves.com</p>
                  <p className="text-gray-300">Phone: +91 (555) 123-4567</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white p-8 rounded-lg shadow-xl"
            >
              <ContactForm />
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;