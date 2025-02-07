import { motion } from "framer-motion";
import { ContactForm } from "@/components/contact/ContactForm";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

const Contact = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('contact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        <section className="py-16 px-4" id="contact-form">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900 text-white p-8 rounded-lg space-y-6"
            >
              <div className="space-y-8">
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

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="pt-8 px-4"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-rose-600 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                    <Button
                      onClick={scrollToForm}
                      size="lg"
                      className="relative w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-10 py-7 rounded-full text-lg font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/25 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="flex items-center justify-center gap-3">
                        <Mail className="h-6 w-6 transition-transform group-hover:scale-110" />
                        <span className="text-xl">Get in Touch</span>
                        <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Button>
                  </div>
                  <p className="text-center text-gray-400 text-sm mt-4">
                    We'll get back to you within 24 hours
                  </p>
                </motion.div>
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