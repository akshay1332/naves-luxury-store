import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Home, ShoppingBag, Info, Phone, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styled from 'styled-components';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";
import { CartIndicator } from "./cart/CartIndicator";
import { NotificationBell } from "./notifications/NotificationBell";
import { NavBar } from "@/components/ui/tubelight-navbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { theme as themeConfig } from '../styles/theme';

interface ThemeProps {
  $currentTheme: 'light' | 'dark';
}

const StyledNav = styled(motion.nav)<ThemeProps>`
  background: ${props => props.$currentTheme === 'dark' 
    ? `${themeConfig.dark.surface}E6` // E6 for 90% opacity
    : `${themeConfig.light.surface}E6`};
  backdrop-filter: blur(8px);
  border-bottom: 1px solid ${props => props.$currentTheme === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'};
  box-shadow: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.shadows.default
    : themeConfig.light.shadows.default};
`;

const BrandText = styled(motion.h1)<ThemeProps>`
  font-size: 2.25rem;
  font-family: 'Playfair Display', serif;
  font-weight: bold;
  letter-spacing: -0.025em;
  background: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.gradients.primary
    : themeConfig.light.gradients.primary};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transition: all 0.3s ease-in-out;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${props => props.$currentTheme === 'dark'
      ? themeConfig.dark.gradients.primary
      : themeConfig.light.gradients.primary};
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.4s ease-out;
  }

  &:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }
`;

const NavLink = styled(Link)<ThemeProps>`
  color: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.text.primary
    : themeConfig.light.text.primary};
  transition: color 0.3s ease-in-out;

  &:hover {
    color: ${props => props.$currentTheme === 'dark'
      ? themeConfig.dark.primaryAccent
      : themeConfig.light.primaryAccent};
  }
`;

const MobileMenu = styled(motion.div)<ThemeProps>`
  background: ${props => props.$currentTheme === 'dark'
    ? `${themeConfig.dark.surface}F2` // F2 for 95% opacity
    : `${themeConfig.light.surface}F2`};
  backdrop-filter: blur(12px);
  border-top: 1px solid ${props => props.$currentTheme === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'};
`;

const MobileNavLink = styled(Link)<ThemeProps>`
  display: block;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-family: serif;
  font-weight: 500;
  color: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.text.primary
    : themeConfig.light.text.primary};
  transition: all 0.3s ease-in-out;

  &:hover {
    background: ${props => props.$currentTheme === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.05)'};
    color: ${props => props.$currentTheme === 'dark'
      ? themeConfig.dark.primaryAccent
      : themeConfig.light.primaryAccent};
  }
`;

const IconButton = styled(motion.button)<ThemeProps>`
  color: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.primaryAccent
    : themeConfig.light.primaryAccent};
  transition: color 0.3s ease-in-out;

  &:hover {
    color: ${props => props.$currentTheme === 'dark'
      ? themeConfig.dark.secondaryAccent
      : themeConfig.light.secondaryAccent};
  }
`;

const StyledDropdownContent = styled(DropdownMenuContent)<ThemeProps>`
  background: ${props => props.$currentTheme === 'dark'
    ? `${themeConfig.dark.surface}F2`
    : `${themeConfig.light.surface}F2`};
  backdrop-filter: blur(8px);
  border: 1px solid ${props => props.$currentTheme === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'};
  box-shadow: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.shadows.default
    : themeConfig.light.shadows.default};
`;

const StyledDropdownItem = styled(DropdownMenuItem)<ThemeProps>`
  color: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.text.primary
    : themeConfig.light.text.primary};
  font-family: serif;

  &:hover {
    color: ${props => props.$currentTheme === 'dark'
      ? themeConfig.dark.primaryAccent
      : themeConfig.light.primaryAccent};
    background: ${props => props.$currentTheme === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
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
    <StyledNav
      $currentTheme={currentTheme}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 z-50 w-full"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <BrandText
                $currentTheme={currentTheme}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Custom Prints
              </BrandText>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavBar 
              items={navItems.map(item => ({
                ...item,
                className: `text-${currentTheme === 'dark' ? 'white' : 'black'} hover:text-${currentTheme === 'dark' ? themeConfig.dark.primaryAccent : themeConfig.light.primaryAccent}`
              }))}
              className="!static !translate-x-0 text-lg font-serif tracking-wide"
            />
            {isAuthenticated && (
              <>
                <NavLink to="/cart" $currentTheme={currentTheme}>
                  <CartIndicator />
                </NavLink>
                <NotificationBell />
              </>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton $currentTheme={currentTheme} whileTap={{ scale: 0.95 }}>
                  <User className="h-5 w-5" />
                </IconButton>
              </DropdownMenuTrigger>
              <StyledDropdownContent $currentTheme={currentTheme} align="end" className="w-56">
                {isAuthenticated ? (
                  <>
                    <StyledDropdownItem $currentTheme={currentTheme} onClick={() => navigate('/profile')}>
                      Profile
                    </StyledDropdownItem>
                    <StyledDropdownItem $currentTheme={currentTheme} onClick={() => navigate('/admin')}>
                      Admin Dashboard
                    </StyledDropdownItem>
                    <StyledDropdownItem $currentTheme={currentTheme} onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </StyledDropdownItem>
                  </>
                ) : (
                  <StyledDropdownItem $currentTheme={currentTheme} onClick={handleLogin}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </StyledDropdownItem>
                )}
              </StyledDropdownContent>
            </DropdownMenu>
          </div>

          <IconButton
            $currentTheme={currentTheme}
            whileTap={{ scale: 0.95 }}
            className="flex md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </IconButton>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <MobileMenu
            $currentTheme={currentTheme}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="space-y-2 px-4 pb-4 pt-2">
              {navItems.map((item) => (
                <MobileNavLink
                  key={item.name}
                  to={item.url}
                  $currentTheme={currentTheme}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="inline-block w-5 h-5 mr-3" />
                  {item.name}
                </MobileNavLink>
              ))}
              {isAuthenticated ? (
                <>
                  <MobileNavLink
                    to="/cart"
                    $currentTheme={currentTheme}
                    onClick={() => setIsOpen(false)}
                  >
                    Cart
                  </MobileNavLink>
                  <MobileNavLink
                    to="/profile"
                    $currentTheme={currentTheme}
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </MobileNavLink>
                  <MobileNavLink
                    to="#"
                    $currentTheme={currentTheme}
                    as="button"
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left"
                  >
                    Logout
                  </MobileNavLink>
                </>
              ) : (
                <MobileNavLink
                  to="#"
                  $currentTheme={currentTheme}
                  as="button"
                  onClick={() => {
                    setIsOpen(false);
                    handleLogin();
                  }}
                  className="w-full text-left"
                >
                  Login
                </MobileNavLink>
              )}
            </div>
          </MobileMenu>
        )}
      </AnimatePresence>
    </StyledNav>
  );
};

export default Navbar;