import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Home, ShoppingBag, Info, Phone, LogIn, Bell, Search } from "lucide-react";
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
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme: currentTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();

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
    } catch (error: any) {
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

  return (
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
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={cn(
                  "p-1.5 rounded-full transition-colors duration-300",
                  "hover:bg-primary-light/10",
                  currentTheme === 'dark' ? "text-luxury-pearl" : "text-luxury-gold"
                )}
              >
                <Search className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={searchVariants}
                    type="text"
                    placeholder="Search..."
                    className={cn(
                      "absolute right-10 ml-2 px-3 py-1 rounded-full text-sm",
                      "border focus:outline-none focus:ring-2 focus:ring-primary-light",
                      currentTheme === 'dark' 
                        ? "bg-gray-800/50 border-gray-700 text-luxury-pearl placeholder-gray-400" 
                        : "bg-white/50 border-gray-200 text-luxury-gold placeholder-gray-500"
                    )}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Year Text - Hidden on Mobile */}
            <div className={cn(
              "hidden lg:block font-montserrat text-xl font-black tracking-wide",
              currentTheme === 'dark' ? "text-luxury-pearl" : "text-luxury-gold"
            )}>
              2024
            </div>

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
                <DropdownMenuContent align="end" className="w-48">
                  {isAuthenticated ? (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4 text-primary-light" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <ShoppingBag className="mr-2 h-4 w-4 text-primary-light" />
                        Admin Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4 text-primary-light" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={handleLogin}>
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
  );
};

export default Navbar;