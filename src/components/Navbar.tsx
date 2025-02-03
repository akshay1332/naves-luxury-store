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

  const hamburgerVariants = {
    closed: {
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.3
      }
    },
    open: {
      rotate: 45,
      scale: 1.1,
      transition: {
        duration: 0.3
      }
    }
  };

  const Path = (props: any) => (
    <motion.path
      fill="transparent"
      strokeWidth="2"
      stroke={currentTheme === 'dark' ? "white" : "black"}
      strokeLinecap="round"
      {...props}
    />
  );

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
    // Scroll to top after navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        ? "bg-gray-900/95 border-gray-800 backdrop-blur-md" 
        : "bg-white/95 border-gray-100 backdrop-blur-md"
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
                    currentTheme === 'dark' ? "text-white" : "text-gray-800"
                  )}
                >
                  CUSTOM<span className="text-primary">PRINT</span>
                </motion.div>
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={cn(
                "uppercase text-sm tracking-wider font-semibold font-montserrat transition-colors duration-300 hover:text-primary",
                currentTheme === 'dark' ? "text-gray-200" : "text-gray-700"
              )}
            >
              HOME
            </Link>
            <Link 
              to="/products" 
              className={cn(
                "uppercase text-sm tracking-wider font-semibold font-montserrat transition-colors duration-300 hover:text-primary",
                currentTheme === 'dark' ? "text-gray-200" : "text-gray-700"
              )}
            >
              PRODUCTS
            </Link>
            <Link 
              to="/about" 
              className={cn(
                "uppercase text-sm tracking-wider font-semibold font-montserrat transition-colors duration-300 hover:text-primary",
                currentTheme === 'dark' ? "text-gray-200" : "text-gray-700"
              )}
            >
              ABOUT
            </Link>
            <Link 
              to="/contact" 
              className={cn(
                "uppercase text-sm tracking-wider font-semibold font-montserrat transition-colors duration-300 hover:text-primary",
                currentTheme === 'dark' ? "text-gray-200" : "text-gray-700"
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
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  currentTheme === 'dark' ? "text-gray-200" : "text-gray-700"
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
                      "border focus:outline-none focus:ring-2 focus:ring-primary",
                      currentTheme === 'dark' 
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400" 
                        : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500"
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
              currentTheme === 'dark' ? "text-gray-200" : "text-gray-800"
            )}>
              2024
            </div>

            {/* Auth and Cart Actions */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  <Link 
                    to="/cart"
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                  >
                      <CartIndicator />
                  </Link>
                  <div className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
                    <NotificationBell />
                  </div>
                </div>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "p-1.5 rounded-full transition-colors duration-300",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    currentTheme === 'dark' ? "text-white" : "text-gray-900"
                  )}>
                    <User className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isAuthenticated ? (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4 text-rose-500" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <ShoppingBag className="mr-2 h-4 w-4 text-rose-500" />
                        Admin Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4 text-rose-500" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={handleLogin}>
                      <LogIn className="mr-2 h-4 w-4 text-rose-500" />
                      Login
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Modern Hamburger Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "md:hidden p-1.5 rounded-lg transition-colors duration-300 relative",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                currentTheme === 'dark' ? "text-white" : "text-gray-900"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MenuIcon />
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu with Enhanced Animations */}
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              variants={{
                closed: {
                  opacity: 0,
                  height: 0,
                  transition: {
                    duration: 0.3,
                    staggerChildren: 0.05,
                    staggerDirection: -1,
                    ease: "easeInOut"
                  }
                },
                open: {
                  opacity: 1,
                  height: "auto",
                  transition: {
                    duration: 0.3,
                    staggerChildren: 0.05,
                    delayChildren: 0.1,
                    ease: "easeInOut"
                  }
                }
              }}
              initial="closed"
              animate="open"
              exit="closed"
              className={cn(
                "md:hidden overflow-hidden absolute top-full left-0 right-0 max-h-[calc(100vh-4rem)]",
                "backdrop-blur-lg bg-white/90 dark:bg-gray-900/90",
                "border-b border-gray-200 dark:border-gray-800",
                "shadow-lg overflow-y-auto"
              )}
            >
              <div className="py-1 space-y-0.5">
                {isAuthenticated && (
                  <>
                    <motion.div variants={itemVariants}>
                      <div
                        onClick={() => handleNavigation('/cart')}
                        className={cn(
                          "flex items-center px-4 py-3 text-sm font-semibold cursor-pointer",
                          "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300",
                          currentTheme === 'dark' ? "text-white" : "text-gray-900"
                        )}
                      >
                        <ShoppingBag className="h-5 w-5 mr-3 text-rose-500" />
                      CART
                      <div className="ml-auto">
                        <CartIndicator />
                        </div>
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <div
                        className={cn(
                          "flex items-center px-4 py-3 text-sm font-semibold",
                          "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300",
                          currentTheme === 'dark' ? "text-white" : "text-gray-900"
                        )}
                      >
                        <Bell className="h-5 w-5 mr-3 text-rose-500" />
                      NOTIFICATIONS
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
                    <div
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-semibold cursor-pointer",
                        "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300",
                        "transform hover:translate-x-2 transition-transform duration-200",
                        currentTheme === 'dark' ? "text-white" : "text-gray-900"
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-3 text-rose-500" />
                      {item.label}
                    </div>
                  </motion.div>
                ))}

                {isAuthenticated ? (
                  <>
                    <motion.div variants={itemVariants}>
                      <div
                        onClick={() => handleNavigation('/profile')}
                        className={cn(
                          "flex items-center px-4 py-3 text-sm font-semibold cursor-pointer",
                          "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300",
                          "transform hover:translate-x-2 transition-transform duration-200",
                          currentTheme === 'dark' ? "text-white" : "text-gray-900"
                        )}
                      >
                        <User className="h-5 w-5 mr-3 text-rose-500" />
                      PROFILE
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <div
                      onClick={handleLogout}
                        className={cn(
                          "flex items-center px-4 py-3 text-sm font-semibold cursor-pointer",
                          "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300",
                          "transform hover:translate-x-2 transition-transform duration-200",
                          currentTheme === 'dark' ? "text-white" : "text-gray-900"
                        )}
                      >
                        <LogOut className="h-5 w-5 mr-3 text-rose-500" />
                      LOGOUT
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <motion.div variants={itemVariants}>
                    <div
                    onClick={handleLogin}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-semibold cursor-pointer",
                        "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300",
                        "transform hover:translate-x-2 transition-transform duration-200",
                        currentTheme === 'dark' ? "text-white" : "text-gray-900"
                      )}
                    >
                      <LogIn className="h-5 w-5 mr-3 text-rose-500" />
                    LOGIN
                    </div>
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
