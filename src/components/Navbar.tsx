import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Home, ShoppingBag, Info, Phone, LogIn, Bell, Search, PhoneCall } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";
import { CartIndicator } from "./cart/CartIndicator";
import { NotificationBell } from "./notifications/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import logo from '../assets/logo.jpg';
import { cn, formatIndianPrice } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearch } from "@/hooks/useSearch";
import { useUser } from "@/hooks/useUser";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SearchBar } from "@/components/ui/SearchBar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { theme: currentTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { searchResults, isSearching } = useSearch();
  const { user } = useUser();
  const isAdmin = user?.user_metadata?.isAdmin || false;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Success",
        description: "Logged out successfully.",
      });
      navigate('/login');
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const logoVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      rotate: [0, -5, 5, -5, 0],
      transition: {
        duration: 0.3,
        rotate: {
          repeat: 0,
          duration: 0.5
        }
      }
    }
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    closed: {
      x: -16,
      opacity: 0
    },
    open: {
      x: 0,
      opacity: 1
    }
  };

  return (
    <>
      {/* Sticky Contact Icons */}
      <div className="fixed right-4 bottom-4 flex flex-col gap-3 z-50">
        {/* WhatsApp Icon */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="https://wa.me/916284249565"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  "bg-green-500 hover:bg-green-600 transition-colors duration-300",
                  "shadow-lg hover:shadow-xl",
                  "text-white"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.89 5.83L2.29 22l4.17-1.59C7.88 21.44 9.89 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.85 0-3.65-.54-5.19-1.56l-.37-.22-3.83 1.46 1.46-3.83-.22-.37C2.54 15.65 2 13.85 2 12c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9zm-4.5-9c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5zm6 0c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Chat on WhatsApp</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Call Icon */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="tel:+916284249565"
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  "bg-blue-500 hover:bg-blue-600 transition-colors duration-300",
                  "shadow-lg hover:shadow-xl",
                  "text-white"
                )}
              >
                <PhoneCall className="w-6 h-6" />
              </a>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Call us</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      "border-b shadow-sm py-1",
      currentTheme === 'dark' 
        ? "bg-gray-900/80 border-gray-800 backdrop-blur-md" 
        : "bg-white/80 border-gray-100 backdrop-blur-md"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <img 
                src={logo} 
                alt="Custom Print Logo" 
                className="h-12 w-auto transform group-hover:scale-105 transition-transform duration-300"
              />
              <motion.div
                className="absolute inset-0 bg-primary/10 rounded-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 0 }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            <div className="flex flex-col">
              <motion.span
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              >
                CUSTOM PRINT
              </motion.span>
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-gray-500"
              >
                Premium Custom Apparel
              </motion.span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={cn(
                "uppercase text-sm tracking-wider font-semibold font-montserrat transition-colors duration-300 hover:text-primary-light",
                currentTheme === 'dark' ? "text-luxury-pearl" : "text-luxury-gold"
              )}
            >
              HOME
            </Link>
            <Link 
              to="/products" 
              className={cn(
                "uppercase text-sm tracking-wider font-semibold font-montserrat transition-colors duration-300 hover:text-primary-light",
                currentTheme === 'dark' ? "text-luxury-pearl" : "text-luxury-gold"
              )}
            >
              PRODUCTS
            </Link>
            <Link 
              to="/about" 
              className={cn(
                "uppercase text-sm tracking-wider font-semibold font-montserrat transition-colors duration-300 hover:text-primary-light",
                currentTheme === 'dark' ? "text-luxury-pearl" : "text-luxury-gold"
              )}
            >
              ABOUT
            </Link>
            <Link 
              to="/contact" 
              className={cn(
                "uppercase text-sm tracking-wider font-semibold font-montserrat transition-colors duration-300 hover:text-primary-light",
                currentTheme === 'dark' ? "text-luxury-pearl" : "text-luxury-gold"
              )}
            >
              CONTACT
            </Link>

            {/* Replace the old search implementation with new SearchBar */}
            <SearchBar />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Auth and Cart Actions */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  <Link 
                    to="/cart"
                    className={cn(
                      "p-1.5 rounded-full transition-colors duration-300",
                      "hover:bg-primary-light/10",
                      currentTheme === 'dark' ? "text-luxury-pearl" : "text-luxury-gold"
                    )}
                  >
                    <CartIndicator />
                  </Link>
                  <div className={cn(
                    "p-1.5 rounded-full transition-colors duration-300",
                    "hover:bg-primary-light/10",
                    currentTheme === 'dark' ? "text-luxury-pearl" : "text-luxury-gold"
                  )}>
                    <NotificationBell />
                  </div>
                </div>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
                      <AvatarFallback>
                        {user?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem 
                    className="cursor-pointer" 
                    onClick={() => navigate('/profile')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "md:hidden p-1.5 rounded-lg transition-colors duration-300 relative",
                "hover:bg-primary-light/10",
                currentTheme === 'dark' ? "text-luxury-pearl" : "text-luxury-gold"
              )}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={cn(
                "md:hidden overflow-hidden",
                "absolute top-full left-0 right-0",
                "backdrop-blur-lg",
                currentTheme === 'dark'
                  ? "bg-gray-900/90 border-b border-gray-800"
                  : "bg-white/90 border-b border-gray-200"
              )}
            >
              <div className="py-2 space-y-1">
                {isAuthenticated && (
                  <>
                    <motion.div variants={itemVariants}>
                      <Link
                        to="/cart"
                        className={cn(
                          "flex items-center px-4 py-2",
                          "text-sm font-semibold",
                          currentTheme === 'dark' ? "text-luxury-pearl" : "text-luxury-gold",
                          "hover:bg-primary-light/10"
                        )}
                      >
                        <ShoppingBag className="h-5 w-5 mr-3" />
                        Cart
                        <div className="ml-auto">
                          <CartIndicator />
                        </div>
                      </Link>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <div className={cn(
                        "flex items-center px-4 py-2",
                        "text-sm font-semibold",
                        currentTheme === 'dark' ? "text-luxury-pearl" : "text-luxury-gold",
                        "hover:bg-primary-light/10"
                      )}>
                        <Bell className="h-5 w-5 mr-3" />
                        Notifications
                        <div className="ml-auto">
                          <NotificationBell />
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}

                {[
                  { path: '/', icon: Home, label: 'HOME' },
                  { path: '/products', icon: ShoppingBag, label: 'PRODUCTS' },
                  { path: '/about', icon: Info, label: 'ABOUT' },
                  { path: '/contact', icon: Phone, label: 'CONTACT' }
                ].map((item) => (
                  <motion.div key={item.path} variants={itemVariants}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center px-4 py-2",
                        "text-sm font-semibold",
                        currentTheme === 'dark' ? "text-luxury-pearl" : "text-luxury-gold",
                        "hover:bg-primary-light/10"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {isAuthenticated ? (
                  <>
                    <motion.div variants={itemVariants}>
                      <Link
                        to="/profile"
                        className={cn(
                          "flex items-center px-4 py-2",
                          "text-sm font-semibold",
                          currentTheme === 'dark' ? "text-luxury-pearl" : "text-luxury-gold",
                          "hover:bg-primary-light/10"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="h-5 w-5 mr-3" />
                        PROFILE
                      </Link>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className={cn(
                          "flex items-center px-4 py-2 w-full",
                          "text-sm font-semibold text-left",
                          currentTheme === 'dark' ? "text-luxury-pearl" : "text-luxury-gold",
                          "hover:bg-primary-light/10"
                        )}
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        LOGOUT
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div variants={itemVariants}>
                    <button
                      onClick={() => {
                        handleLogin();
                        setIsOpen(false);
                      }}
                      className={cn(
                        "flex items-center px-4 py-2 w-full",
                        "text-sm font-semibold text-left",
                        currentTheme === 'dark' ? "text-luxury-pearl" : "text-luxury-gold",
                        "hover:bg-primary-light/10"
                      )}
                    >
                      <LogIn className="h-5 w-5 mr-3" />
                      LOGIN
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
    </>
  );
};

export default Navbar;