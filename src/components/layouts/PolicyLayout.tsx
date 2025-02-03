import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface PolicyLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const PolicyLayout = ({ children, title, subtitle }: PolicyLayoutProps) => {
  const { theme: currentTheme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pt-24 pb-16"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "text-3xl md:text-4xl font-bold font-montserrat tracking-tight",
              currentTheme === 'dark' ? "text-white" : "text-gray-900"
            )}
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={cn(
                "mt-4 text-lg",
                currentTheme === 'dark' ? "text-gray-300" : "text-gray-600"
              )}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "prose prose-lg max-w-none",
            "prose-headings:font-montserrat prose-headings:font-semibold",
            "prose-p:leading-relaxed prose-p:mb-6",
            "prose-strong:font-semibold",
            "prose-ul:list-disc prose-ul:pl-6",
            "prose-ol:list-decimal prose-ol:pl-6",
            currentTheme === 'dark' 
              ? "prose-invert prose-p:text-gray-300 prose-headings:text-white" 
              : "prose-p:text-gray-600 prose-headings:text-gray-900"
          )}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PolicyLayout; 