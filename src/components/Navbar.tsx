import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Home, ShoppingBag, Info, Phone, LogIn, Bell, Layers } from "lucide-react";
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
import logo from '../assets/logo.png'

interface ThemeProps {
  $currentTheme: 'light' | 'dark';
}

const StyledNav = styled(motion.nav)<ThemeProps>`
  background: ${props => props.$currentTheme === 'dark' 
    ? '#111111'
    : '#FFFFFF'};
  border-bottom: 1px solid ${props => props.$currentTheme === 'dark'
    ? 'rgba(255, 255, 255, 0.15)'
    : 'rgba(0, 0, 0, 0.15)'};
  padding: 0.5rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 0.25rem 0;
  }
`;

const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 1rem;
  transition: all 0.4s ease;
  background: linear-gradient(135deg, rgba(0, 191, 165, 0.05) 0%, rgba(0, 229, 255, 0.05) 100%);

  &:hover {
    background: linear-gradient(135deg, rgba(0, 191, 165, 0.1) 0%, rgba(0, 229, 255, 0.1) 100%);
    transform: translateY(-2px);
  }
`;

const LogoImage = styled(motion.img)`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 191, 165, 0.2);
  transition: all 0.4s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 191, 165, 0.4);
  }
`;

const BrandText = styled(motion.div)`
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-size: 2.5rem;
  color: ${props => props.$currentTheme === 'dark' ? '#FFFFFF' : '#000000'};
  letter-spacing: 3px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 4px;
  text-shadow: ${props => props.$currentTheme === 'dark' 
    ? '0 2px 4px rgba(0, 0, 0, 0.3)'
    : '0 2px 4px rgba(0, 0, 0, 0.1)'};

  span {
    color: #FF3366;
    font-weight: 800;
  }

  @media (max-width: 1024px) {
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    letter-spacing: 2px;
  }
`;

const NavLinksContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 1024px) {
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)<ThemeProps>`
  color: ${props => props.$currentTheme === 'dark' ? '#FFFFFF' : '#111111'};
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1.5px;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  white-space: nowrap;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 80%;
    height: 2px;
    background: #FF3366;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #FF3366;
    transform: translateY(-1px);

    &:after {
      transform: translateX(-50%) scaleX(1);
    }
  }

  @media (max-width: 1024px) {
    font-size: 0.85rem;
    padding: 0.5rem 0.75rem;
  }
`;

const YearText = styled.div<ThemeProps>`
  font-family: 'Montserrat', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  color: ${props => props.$currentTheme === 'dark' ? '#FFFFFF' : '#111111'};
  letter-spacing: 2px;
  text-shadow: ${props => props.$currentTheme === 'dark' 
    ? '0 2px 4px rgba(0, 0, 0, 0.3)'
    : '0 2px 4px rgba(0, 0, 0, 0.1)'};

  @media (max-width: 1024px) {
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const MobileMenu = styled(motion.div)<ThemeProps>`
  background: ${props => props.$currentTheme === 'dark' ? '#1A1A1A' : '#FFFFFF'};
  border-top: 1px solid ${props => props.$currentTheme === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const MobileNavLink = styled(Link)<ThemeProps>`
  display: flex;
  align-items: center;
  padding: 0.875rem 1.25rem;
  color: ${props => props.$currentTheme === 'dark' ? '#FFFFFF' : '#111111'};
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1.5px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  border-bottom: 1px solid ${props => props.$currentTheme === 'dark'
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.08)'};

  &:hover {
    color: #FF3366;
    background: ${props => props.$currentTheme === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.03)'};
  }

  svg {
    margin-right: 1rem;
    width: 1.25rem;
    height: 1.25rem;
    color: #FF3366;
  }

  &.notification-link, &.cart-link {
    background: ${props => props.$currentTheme === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.03)'};
    font-weight: 700;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 0.75rem 1rem;
  }
`;

const MobileActionsContainer = styled.div`
  display: none;
  align-items: center;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const IconButton = styled(motion.button)<ThemeProps>`
  color: ${props => props.$currentTheme === 'dark' ? '#FFFFFF' : '#111111'};
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 0.375rem;

  &:hover {
    color: #FF3366;
    background: ${props => props.$currentTheme === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.05)'};
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const StyledDropdownContent = styled(DropdownMenuContent)<ThemeProps>`
  background: ${props => props.$currentTheme === 'dark'
    ? '#111111'
    : '#FFFFFF'};
  border: 1px solid ${props => props.$currentTheme === 'dark'
    ? 'rgba(255, 255, 255, 0.15)'
    : 'rgba(0, 0, 0, 0.15)'};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-top: 0.5rem;
`;

const StyledDropdownItem = styled(DropdownMenuItem)<ThemeProps>`
  color: ${props => props.$currentTheme === 'dark' ? '#FFFFFF' : '#111111'};
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: #FF3366;
  }

  &:hover {
    color: #FF3366;
    background: ${props => props.$currentTheme === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const ActionIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-left: 2rem;

  @media (max-width: 1024px) {
    margin-left: 1rem;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const IconWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:hover {
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

  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Products', url: '/products', icon: ShoppingBag },
    { name: 'About', url: '/about', icon: Info },
    { name: 'Contact', url: '/contact', icon: Phone }
  ];

  return (
    <StyledNav $currentTheme={currentTheme}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/">
              <BrandText $currentTheme={currentTheme}>
                CUSTOM<span>PRINT</span>
              </BrandText>
            </Link>
          </div>

          <NavLinksContainer>
            <NavLink to="/" $currentTheme={currentTheme}>HOME</NavLink>
            <NavLink to="/products" $currentTheme={currentTheme}>PRODUCTS</NavLink>
            <NavLink to="/about" $currentTheme={currentTheme}>ABOUT US</NavLink>
            <NavLink to="/contact" $currentTheme={currentTheme}>CONTACT US</NavLink>
          </NavLinksContainer>

          <div className="flex items-center space-x-4">
            <YearText $currentTheme={currentTheme}>2024</YearText>

            <div className="hidden md:flex items-center">
              {isAuthenticated && (
                <ActionIcons>
                  <IconWrapper $currentTheme={currentTheme}>
                    <NavLink to="/cart" $currentTheme={currentTheme}>
                      <CartIndicator />
                    </NavLink>
                  </IconWrapper>
                  <IconWrapper $currentTheme={currentTheme}>
                    <NotificationBell />
                  </IconWrapper>
                </ActionIcons>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton $currentTheme={currentTheme}>
                    <User className="h-5 w-5" />
                  </IconButton>
                </DropdownMenuTrigger>
                <StyledDropdownContent $currentTheme={currentTheme} align="end" className="w-56">
                  {isAuthenticated ? (
                    <>
                      <StyledDropdownItem $currentTheme={currentTheme} onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </StyledDropdownItem>
                      <StyledDropdownItem $currentTheme={currentTheme} onClick={() => navigate('/admin')}>
                        <ShoppingBag className="mr-2 h-4 w-4" />
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

            <MobileActionsContainer>
              <IconButton
                $currentTheme={currentTheme}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </IconButton>
            </MobileActionsContainer>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <MobileMenu
              $currentTheme={currentTheme}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="py-2">
                {isAuthenticated && (
                  <>
                    <MobileNavLink to="/cart" $currentTheme={currentTheme} className="cart-link">
                      <ShoppingBag className="h-5 w-5" />
                      CART
                      <div className="ml-auto">
                        <CartIndicator />
                      </div>
                    </MobileNavLink>
                    <MobileNavLink to="#" $currentTheme={currentTheme} className="notification-link">
                      <Bell className="h-5 w-5" />
                      NOTIFICATIONS
                      <div className="ml-auto">
                        <NotificationBell />
                      </div>
                    </MobileNavLink>
                  </>
                )}

                <MobileNavLink to="/" $currentTheme={currentTheme}>
                  <Home className="h-5 w-5" />
                  HOME
                </MobileNavLink>
                <MobileNavLink to="/products" $currentTheme={currentTheme}>
                  <ShoppingBag className="h-5 w-5" />
                  PRODUCTS
                </MobileNavLink>
                <MobileNavLink to="/about" $currentTheme={currentTheme}>
                  <Info className="h-5 w-5" />
                  ABOUT US
                </MobileNavLink>
                <MobileNavLink to="/contact" $currentTheme={currentTheme}>
                  <Phone className="h-5 w-5" />
                  CONTACT US
                </MobileNavLink>

                {isAuthenticated ? (
                  <>
                    <MobileNavLink to="/profile" $currentTheme={currentTheme}>
                      <User className="h-5 w-5" />
                      PROFILE
                    </MobileNavLink>
                    <MobileNavLink 
                      to="#" 
                      as="button" 
                      $currentTheme={currentTheme}
                      onClick={handleLogout}
                      className="w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      LOGOUT
                    </MobileNavLink>
                  </>
                ) : (
                  <MobileNavLink 
                    to="#" 
                    as="button" 
                    $currentTheme={currentTheme}
                    onClick={handleLogin}
                    className="w-full text-left"
                  >
                    <LogIn className="h-5 w-5" />
                    LOGIN
                  </MobileNavLink>
                )}
              </div>
            </MobileMenu>
          )}
        </AnimatePresence>
      </div>
    </StyledNav>
  );
};

export default Navbar;