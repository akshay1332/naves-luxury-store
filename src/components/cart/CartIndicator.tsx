import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export const CartIndicator = () => {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    fetchCartCount();
    const channel = supabase
      .channel('cart_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'cart_items' 
      }, () => {
        fetchCartCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCartCount = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', user.id);

    if (data) {
      const total = data.reduce((sum, item) => sum + item.quantity, 0);
      setItemCount(total);
    }
  };

  return (
    <div className="relative">
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge 
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-primary"
        >
          {itemCount}
        </Badge>
      )}
    </div>
  );
};