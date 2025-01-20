import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Home, ShoppingBag, Info, Phone, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CartIndicator } from "./cart/CartIndicator";
import { NotificationBell } from "./notifications/NotificationBell";
import { NavBar } from "@/components/ui/tubelight-navbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out.",
      });
      return;
    }
    toast({
      title: "Success",
      description: "Logged out successfully.",
    });
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Products', url: '/products', icon: ShoppingBag },
    { name: 'About', url: '/about', icon: Info },
    { name: 'Contact', url: '/contact', icon: Phone }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-lg shadow-md"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <motion.h1 
              className="text-3xl font-serif font-bold tracking-tight bg-clip-text text-transparent bg-luxury-gradient hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Label Naves
            </motion.h1>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavBar items={navItems} className="!static !translate-x-0" />
            {isAuthenticated && (
              <>
                <Link to="/cart" className="nav-link hover:text-luxury-gold transition-colors">
                  <CartIndicator />
                </Link>
                <NotificationBell />
              </>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger className="nav-link hover:text-luxury-gold transition-colors">
                <User className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-sm border border-luxury-gold/20 shadow-xl">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:text-luxury-gold">
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="hover:text-luxury-gold">
                      Admin Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="hover:text-luxury-gold">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={handleLogin} className="hover:text-luxury-gold">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex md:hidden text-luxury-gold"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-luxury-gold/10"
          >
            <div className="space-y-2 px-4 pb-4 pt-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.url}
                  className="block rounded-md px-3 py-2.5 text-base font-serif font-medium text-gray-700 hover:bg-luxury-pearl hover:text-luxury-gold transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="inline-block w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/cart"
                    className="block rounded-md px-3 py-2.5 text-base font-serif font-medium text-gray-700 hover:bg-luxury-pearl hover:text-luxury-gold transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    Cart
                  </Link>
                  <Link
                    to="/profile"
                    className="block rounded-md px-3 py-2.5 text-base font-serif font-medium text-gray-700 hover:bg-luxury-pearl hover:text-luxury-gold transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block rounded-md px-3 py-2.5 text-base font-serif font-medium text-gray-700 hover:bg-luxury-pearl hover:text-luxury-gold transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="w-full text-left block rounded-md px-3 py-2.5 text-base font-serif font-medium text-gray-700 hover:bg-luxury-pearl hover:text-luxury-gold transition-all"
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;