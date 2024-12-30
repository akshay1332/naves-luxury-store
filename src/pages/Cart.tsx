import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash } from "lucide-react";

interface CartItem {
  id: string;
  quantity: number;
  size: string | null;
  color: string | null;
  products: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        size,
        color,
        products (
          id,
          title,
          price,
          images
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch cart items.",
      });
      return;
    }

    setCartItems(data || []);
    setLoading(false);
  };

  const handleRemoveItem = async (id: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item from cart.",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Item removed from cart.",
    });
    fetchCartItems();
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.products.price * item.quantity);
    }, 0);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Button onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="flex items-center gap-4">
                    <img
                      src={item.products.images?.[0] || '/placeholder.svg'}
                      alt={item.products.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span>{item.products.title}</span>
                  </TableCell>
                  <TableCell>{item.size || 'N/A'}</TableCell>
                  <TableCell>{item.color || 'N/A'}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.products.price * item.quantity}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} className="text-right font-bold">
                  Total:
                </TableCell>
                <TableCell className="font-bold">
                  ${calculateTotal()}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>

          <div className="p-4 flex justify-end">
            <Button onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}