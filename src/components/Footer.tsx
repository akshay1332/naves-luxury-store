import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, Linkedin, Heart, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const Footer = () => {
  const { theme: currentTheme } = useTheme();
  
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://www.facebook.com/people/Customs-Print/61572631971693/?rdid=RVPWGDOb86lLuDFg&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F15YVVVdruK%2F"
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/the.customprint",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/custom-print-436307349/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
    {
      icon: MessageCircle,
      href: "https://wa.me/+916284249565",
    }
  ];

  return (
    <motion.footer
      className={cn(
        "w-full py-12 mt-16",
        "border-t transition-colors duration-300",
        currentTheme === 'dark' 
          ? "bg-gray-900 border-gray-800 text-white" 
          : "bg-white border-gray-200 text-gray-900"
      )}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.h3
              className="text-2xl font-bold font-montserrat tracking-wide"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              CUSTOM<span className="text-rose-500">PRINT</span>
            </motion.h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-rose-500" />
                <span className="text-sm">+91 6284 249 565</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-rose-500" />
                <span className="text-sm">support@customprint.co.in</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-rose-500" />
                <span className="text-sm">Jalandhar, Punjab, India</span>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "transition-colors duration-300",
                    currentTheme === 'dark'
                      ? "text-gray-300 hover:text-rose-500"
                      : "text-gray-600 hover:text-rose-500"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={cn(
                    "p-2 rounded-full transition-colors duration-300",
                    currentTheme === 'dark'
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-gray-100 hover:bg-gray-200"
                  )}>
                    <social.icon size={20} className="text-rose-500" />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold font-montserrat tracking-wide">Quick Links</h3>
            <div className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/products", label: "Products" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" }
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={cn(
                    "block text-sm transition-colors duration-300 hover:text-rose-500",
                    currentTheme === 'dark' ? "text-gray-300" : "text-gray-600"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Customer Service */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold font-montserrat tracking-wide">Customer Service</h3>
            <div className="space-y-2">
              {[
                { to: "/faq", label: "FAQ" },
                { to: "/shipping", label: "Shipping Info" },
                { to: "/returns", label: "Returns" },
                { to: "/size-guide", label: "Size Guide" }
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={cn(
                    "block text-sm transition-colors duration-300 hover:text-rose-500",
                    currentTheme === 'dark' ? "text-gray-300" : "text-gray-600"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Legal */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold font-montserrat tracking-wide">Legal</h3>
            <div className="space-y-2">
              {[
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/terms", label: "Terms of Service" },
                { to: "/refund", label: "Refund Policy" },
                { to: "/cookies", label: "Cookie Policy" }
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={cn(
                    "block text-sm transition-colors duration-300 hover:text-rose-500",
                    currentTheme === 'dark' ? "text-gray-300" : "text-gray-600"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          className={cn(
            "mt-12 pt-8 border-t",
            currentTheme === 'dark' ? "border-gray-800" : "border-gray-200"
          )}
          variants={itemVariants}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Copyright */}
            <motion.p 
              className="flex items-center justify-center gap-2 text-sm text-center"
              variants={itemVariants}
            >
              © {new Date().getFullYear()} Custom Print. Made with 
              <motion.span
                animate={{ 
                  scale: [1, 1.2, 1],
                  color: ['#ff0000', '#ff69b4', '#ff0000']
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity
                }}
              >
                <Heart size={16} className="text-rose-500" />
              </motion.span>
              in India
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;