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
          'printing service contact'
        ]}
      />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[40vh] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084"
            alt="Contact Custom Print"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white text-center"
            >
              Contact Us
            </motion.h1>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900 text-white p-8 rounded-lg space-y-6"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-montserrat font-semibold mb-2 text-rose-500">Visit Our Store</h3>
                  <p className="text-gray-300">Custom Print Studio</p>
                  <p className="text-gray-300">Jalandhar, Punjab, 144411</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-montserrat font-semibold mb-2 text-rose-500">Contact Information</h3>
                  <p className="text-gray-300">Email: support@customprint.co.in</p>
                  <p className="text-gray-300">Phone: +91 6284249565</p>
                  <p className="text-gray-300">Hours: Monday-Friday, 10:00AM – 05:00PM</p>
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