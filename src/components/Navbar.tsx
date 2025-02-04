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
} from "@/components/ui/dropdown-menu";
import logo from '../assets/logo.png';
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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme: currentTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { searchResults, isSearching } = useSearch(debouncedSearch);
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

  const searchVariants = {
    hidden: { 
      width: 0,
      opacity: 0,
      transition: { duration: 0.3 }
    },
    visible: { 
      width: "200px",
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const handleSearchFocus = useCallback(() => {
    setIsSearchOpen(true);
    searchInputRef.current?.focus();
  }, []);

  const handleSearchClose = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Close search on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSearchClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleSearchClose]);

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
      <div className="mx-auto max-w-7xl px-2 sm:px-3 lg:px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <motion.div
                className="flex items-center gap-0.5 cursor-pointer p-0.5 rounded-2xl"
                initial="initial"
                whileHover="hover"
                animate="initial"
              >
                <motion.img
                  src={logo}
                  alt="Brand Logo"
                  className="w-10 h-10 md:w-9 md:h-9 object-contain rounded-xl filter drop-shadow-lg"
                  variants={logoVariants}
                  draggable={false}
                />
                <motion.div
                  className={cn(
                    "font-montserrat font-black text-xl md:text-lg tracking-wide uppercase flex items-center gap-0.5",
                    currentTheme === 'dark' ? "text-luxury-pearl" : "text-luxury-gold"
                  )}
                >
                  CUSTOM<span className="text-primary-light">PRINT</span>
                </motion.div>
              </motion.div>
            </Link>
          </div>

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

            {/* Search Icon and Input */}
            <div className="relative flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={handleSearchFocus}
                >
                  <Search className="h-4 w-4" />
                </Button>
                
                <div
                className={cn(
                    "absolute left-0 top-full mt-2",
                    "bg-white dark:bg-gray-900 rounded-lg shadow-lg border dark:border-gray-800",
                    "transition-all duration-200 ease-in-out",
                    isSearchOpen
                      ? "w-[400px] opacity-100 translate-y-0"
                      : "w-0 opacity-0 -translate-y-2 pointer-events-none"
                  )}
                >
                  <div className="relative w-full">
                    <div className="flex items-center p-2 border-b dark:border-gray-800">
                      <Search className="h-4 w-4 text-gray-400 dark:text-gray-600 ml-2" />
                      <Input
                        ref={searchInputRef}
                        className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Search products, categories..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleSearchClose}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Search Results */}
                    <div className="max-h-[400px] overflow-y-auto p-2">
                      {isSearching ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-light" />
                        </div>
                      ) : searchQuery && searchResults.length === 0 ? (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                          No results found
                        </div>
                      ) : searchResults.map((result) => (
                        <Link
                          key={result.id}
                          to={`/products/${result.id}`}
                    className={cn(
                            "flex items-center gap-3 p-2 rounded-lg",
                            "hover:bg-gray-100 dark:hover:bg-gray-800",
                            "transition-colors duration-200"
                          )}
                          onClick={handleSearchClose}
                        >
                          <img
                            src={result.image}
                            alt={result.title}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">
                              {result.title}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatIndianPrice(result.price)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
            </div>
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
                  <button className={cn(
                    "p-1.5 rounded-full transition-colors duration-300",
                    "hover:bg-primary-light/10",
                    currentTheme === 'dark' ? "text-luxury-pearl" : "text-luxury-gold"
                  )}>
                    <User className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className={cn(
                      "w-48 p-2",
                      "bg-white dark:bg-gray-900",
                      "border border-gray-200 dark:border-gray-800",
                      "shadow-lg rounded-lg"
                    )}
                  >
                  {isAuthenticated ? (
                    <>
                        <DropdownMenuItem 
                          onClick={() => navigate('/profile')}
                          className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                        >
                        <User className="mr-2 h-4 w-4 text-primary-light" />
                        Profile
                      </DropdownMenuItem>
                        {isAdmin && (
                          <DropdownMenuItem 
                            onClick={() => navigate('/admin')}
                            className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                          >
                        <ShoppingBag className="mr-2 h-4 w-4 text-primary-light" />
                        Admin Dashboard
                      </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={handleLogout}
                          className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                        >
                        <LogOut className="mr-2 h-4 w-4 text-primary-light" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                      <DropdownMenuItem 
                        onClick={handleLogin}
                        className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                      >
                      <LogIn className="mr-2 h-4 w-4 text-primary-light" />
                      Login
                    </DropdownMenuItem>
                  )}
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