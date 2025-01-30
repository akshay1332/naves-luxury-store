import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, Linkedin, Heart } from "lucide-react";
import { motion } from "framer-motion";
import styled from 'styled-components';
import { useTheme } from "@/hooks/useTheme";
import { theme as themeConfig } from '../styles/theme';

interface ThemeProps {
  $currentTheme: 'light' | 'dark';
}

const FooterContainer = styled(motion.footer)<ThemeProps>`
  background: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.surface
    : themeConfig.light.surface};
  border-top: 1px solid ${props => props.$currentTheme === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'};
  padding: 4rem 0 2rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
`;

const FooterSection = styled(motion.div)`
  h3 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    font-family: 'Playfair Display', serif;
  }
`;

const CompanyInfo = styled.div<ThemeProps>`
  p {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    color: ${props => props.$currentTheme === 'dark'
      ? themeConfig.dark.text.secondary
      : themeConfig.light.text.secondary};
  }

  svg {
    color: ${props => props.$currentTheme === 'dark'
      ? themeConfig.dark.primaryAccent
      : themeConfig.light.primaryAccent};
  }
`;

const FooterLinks = styled.div<ThemeProps>`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  a {
    color: ${props => props.$currentTheme === 'dark'
      ? themeConfig.dark.text.secondary
      : themeConfig.light.text.secondary};
    transition: color 0.3s ease;

    &:hover {
      color: ${props => props.$currentTheme === 'dark'
        ? themeConfig.dark.primaryAccent
        : themeConfig.light.primaryAccent};
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialIcon = styled(motion.a)<ThemeProps>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$currentTheme === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.05)'};
  color: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.text.primary
    : themeConfig.light.text.primary};
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$currentTheme === 'dark'
      ? themeConfig.dark.primaryAccent
      : themeConfig.light.primaryAccent};
    color: white;
    transform: translateY(-3px);
  }
`;

const Copyright = styled(motion.div)<ThemeProps>`
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.$currentTheme === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'};
  color: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.text.secondary
    : themeConfig.light.text.secondary};

  p {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
`;

const Footer = () => {
  const { theme: currentTheme } = useTheme();
  
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <FooterContainer
      $currentTheme={currentTheme}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
            viewport={{ once: true }}
          >
      <FooterContent>
        <FooterGrid>
          <FooterSection variants={itemVariants}>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Custom Print
            </motion.h3>
            <CompanyInfo $currentTheme={currentTheme}>
              <p>
                <Phone size={20} />
                +91 6284 249 565
              </p>
              <p>
                <Mail size={20} />
                support@customprint.co.in
              </p>
              <p>
                <MapPin size={20} />
                India
              </p>
            </CompanyInfo>
            <SocialLinks>
              <SocialIcon 
                href="#" 
                target="_blank"
                $currentTheme={currentTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook size={20} />
              </SocialIcon>
              <SocialIcon 
                href="#" 
                target="_blank"
                $currentTheme={currentTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram size={20} />
              </SocialIcon>
              <SocialIcon 
                href="#" 
                target="_blank"
                $currentTheme={currentTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter size={20} />
              </SocialIcon>
              <SocialIcon 
                href="#" 
                target="_blank"
                $currentTheme={currentTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin size={20} />
              </SocialIcon>
            </SocialLinks>
          </FooterSection>

          <FooterSection variants={itemVariants}>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Quick Links
            </motion.h3>
            <FooterLinks $currentTheme={currentTheme}>
              <Link to="/">Home</Link>
              <Link to="/products">Products</Link>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
            </FooterLinks>
          </FooterSection>

          <FooterSection variants={itemVariants}>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Customer Service
            </motion.h3>
            <FooterLinks $currentTheme={currentTheme}>
              <Link to="/faq">FAQ</Link>
              <Link to="/shipping">Shipping Info</Link>
              <Link to="/returns">Returns</Link>
              <Link to="/size-guide">Size Guide</Link>
            </FooterLinks>
          </FooterSection>

          <FooterSection variants={itemVariants}>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Legal
            </motion.h3>
            <FooterLinks $currentTheme={currentTheme}>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/refund">Refund Policy</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </FooterLinks>
          </FooterSection>
        </FooterGrid>

        <Copyright 
          $currentTheme={currentTheme}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>
            © {new Date().getFullYear()} Custom Print. Made with 
            <motion.span
              animate={{ 
                scale: [1, 1.2, 1],
                color: ['#ff0000', '#ff69b4', '#ff0000']
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity
              }}
            >
              <Heart size={16} />
            </motion.span>
            in India
          </p>
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;