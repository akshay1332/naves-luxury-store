import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface FeaturesProps {
  initialData?: {
    is_featured: boolean;
    is_best_seller: boolean;
    is_new_arrival?: boolean;
    is_trending?: boolean;
  };
}

export const Features = ({ initialData }: FeaturesProps) => {
  const features = [
    { id: 'is_featured', label: 'Featured Product' },
    { id: 'is_best_seller', label: 'Best Seller' },
    { id: 'is_new_arrival', label: 'New Arrival' },
    { id: 'is_trending', label: 'Trending' },
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={feature.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-2"
        >
          <Switch
            name={feature.id}
            id={feature.id}
            defaultChecked={initialData?.[feature.id as keyof typeof initialData]}
            className="data-[state=checked]:bg-luxury-gold"
          />
          <Label htmlFor={feature.id}>{feature.label}</Label>
        </motion.div>
      ))}
    </div>
  );
};