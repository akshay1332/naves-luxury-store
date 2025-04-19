import PolicyLayout from "@/components/layouts/PolicyLayout";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const { theme: currentTheme } = useTheme();
  
  const faqs = [
    {
      question: "What makes Custom Print clothing unique?",
      answer: "Custom Print specializes in high-quality, customizable apparel that combines premium materials with innovative designs. Each piece is crafted with attention to detail, ensuring comfort, durability, and style."
    },
    {
      question: "How do I find my perfect size?",
      answer: "We provide detailed size guides for each product. You can find measurements and fitting recommendations on individual products by clicking the Size Chart. For more assistance, contact our customer support at support@customprint.co.in."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major COD, Credit/Debit Cards, UPI, net banking, and popular digital wallets. All payments are processed securely through our trusted payment partners."
    },
    {
      question: "How long does shipping take?",
      answer: "Domestic orders typically arrive within 5-7 business days. International shipping may take 10-15 business days. You'll receive tracking information once your order ships."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 7-day return policy for unused items in original condition, excluding custom-designed products, with exchanges available for damaged or incorrect orders."
    },
    {
      question: "How do I care for my Custom Print clothing?",
      answer: "Each garment comes with specific care instructions. Generally, we recommend machine washing in cold water, avoiding bleach, and tumble drying on low heat to maintain quality."
    },
    {
      question: "Do you offer bulk or corporate orders?",
      answer: "Yes, we provide special pricing and customization options for bulk and corporate orders. Contact our business team at support@customprint.co.in for details."
    },
    {
      question: "Are your products sustainable?",
      answer: "We are committed to sustainability. Our products use eco-friendly materials where possible, and we continuously work to reduce our environmental impact through responsible manufacturing practices."
    }
  ];

  return (
    <PolicyLayout 
      title="Frequently Asked Questions"
      subtitle="Find answers to common questions about Custom Print products and services"
    >
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className={cn(
              "text-lg font-semibold font-montserrat",
              currentTheme === 'dark' ? "text-white" : "text-gray-900"
            )}>
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className={cn(
              "text-base leading-relaxed",
              currentTheme === 'dark' ? "text-gray-300" : "text-gray-600"
            )}>
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-12 p-6 rounded-lg border text-center">
        <h3 className={cn(
          "text-xl font-semibold mb-4",
          currentTheme === 'dark' ? "text-white" : "text-gray-900"
        )}>
          Still have questions?
        </h3>
        <p className={cn(
          "mb-6",
          currentTheme === 'dark' ? "text-gray-300" : "text-gray-600"
        )}>
          Our customer support team is here to help you
        </p>
        <motion.a
          href="mailto:support@customprint.co.in"
          className={cn(
            "inline-flex items-center justify-center px-6 py-3 rounded-lg",
            "font-semibold text-white bg-rose-500 hover:bg-rose-600",
            "transition-colors duration-300"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Contact Support
        </motion.a>
      </div>
    </PolicyLayout>
  );
};

export default FAQ; 