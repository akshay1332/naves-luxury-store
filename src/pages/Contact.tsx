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
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084"
            alt="Contact Custom Print"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl text-white font-montserrat font-bold"
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
              <h2 className="text-3xl font-montserrat font-bold mb-6 text-rose-500">Get in Touch</h2>
              <p className="text-gray-300 mb-8">
                Have questions about our custom printing services? We're here to help! Fill out the form, and our team will get back to you shortly.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-montserrat font-semibold mb-2 text-rose-500">Visit Our Store</h3>
                  <p className="text-gray-300">Custom Print Studio</p>
                  <p className="text-gray-300">42, Fashion Hub, Sector 18</p>
                  <p className="text-gray-300">Noida, Uttar Pradesh 201301</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-montserrat font-semibold mb-2 text-rose-500">Contact Information</h3>
                  <p className="text-gray-300">Email: support@customprint.co.in</p>
                  <p className="text-gray-300">Phone: +91 98765 43210</p>
                  <p className="text-gray-300">Hours: Mon-Sat, 10:00 AM - 7:00 PM</p>
                </div>

                <div>
                  <h3 className="text-xl font-montserrat font-semibold mb-2 text-rose-500">Follow Us</h3>
                  <p className="text-gray-300">Instagram: @customprint.in</p>
                  <p className="text-gray-300">Facebook: @customprintindia</p>
                  <p className="text-gray-300">Twitter: @customprint_in</p>
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