import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const { data: { user } } = await supabase.auth.getUser();

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          email: formData.get('email') as string,
          subject: formData.get('subject') as string,
          message: formData.get('message') as string,
          name: formData.get('name') as string,
          user_id: user?.id,
          status: 'pending'
        }])
        .select();

      if (error) throw error;

      // Create a notification for admin users
      const { error: notifError } = await supabase
        .from('notifications')
        .insert([{
          title: 'New Contact Message',
          message: `New message from ${formData.get('name')}: ${formData.get('subject')}`,
          type: 'contact_message',
          user_id: user?.id || '',
        }]);

      if (notifError) console.error('Error creating notification:', notifError);

      toast({
        title: "Message Sent",
        description: "We'll get back to you soon!",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit} 
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Input
          name="name"
          placeholder="Your Name"
          required
          className="w-full luxury-input"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Input
          name="email"
          type="email"
          placeholder="Your Email"
          required
          className="w-full luxury-input"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Input
          name="subject"
          placeholder="Subject"
          required
          className="w-full luxury-input"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Textarea
          name="message"
          placeholder="Your Message"
          required
          className="w-full min-h-[150px] luxury-input"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button 
          type="submit" 
          className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-white"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </motion.div>
    </motion.form>
  );
};