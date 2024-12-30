import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  images: string[];
  description?: string;
}

const ProductCard = ({ id, title, price, images, description }: ProductCardProps) => {
  const { toast } = useToast();

  const addToCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .insert({
        user_id: user.id,
        product_id: id,
        quantity: 1,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Item added to cart",
    });
  };

  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <img
          src={images[0] || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link to={`/products/${id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {title}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-sm font-medium text-gray-900">${price}</p>
          <button
            onClick={addToCart}
            className="p-2 rounded-full bg-primary hover:bg-primary-dark text-white"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;