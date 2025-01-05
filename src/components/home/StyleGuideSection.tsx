import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const StyleGuideSection = () => {
  const { data: styleGuides } = useQuery({
    queryKey: ["style-guides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("style_guides")
        .select("*")
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  if (!styleGuides || styleGuides.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Style Guide</h2>
          <p className="text-gray-600">Fashion tips and inspiration</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {styleGuides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                {guide.image_url && (
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={guide.image_url}
                      alt={guide.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <BookOpen className="h-8 w-8 text-luxury-gold mb-4" />
                  <h3 className="text-xl font-serif mb-2">{guide.title}</h3>
                  <p className="text-gray-600 line-clamp-3">{guide.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StyleGuideSection;