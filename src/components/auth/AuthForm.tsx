import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useTheme } from '@/hooks/useTheme';
import { theme as themeConfig } from '@/styles/theme';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

interface ThemeProps {
  $currentTheme: 'light' | 'dark';
}

const AuthContainer = styled(motion.div)<ThemeProps>`
  background: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.surface
    : themeConfig.light.surface};
  border: 1px solid ${props => props.$currentTheme === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'};
  box-shadow: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.shadows.default
    : themeConfig.light.shadows.default};
  border-radius: 1rem;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
`;

const Title = styled(motion.h2)<ThemeProps>`
  color: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.text.primary
    : themeConfig.light.text.primary};
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  font-family: serif;
`;

const InputGroup = styled(motion.div)`
  position: relative;
  margin-bottom: 1.5rem;
`;

const Input = styled(motion.input)<ThemeProps>`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.elevatedSurface
    : themeConfig.light.elevatedSurface};
  border: 2px solid ${props => props.$currentTheme === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 0.75rem;
  color: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.text.primary
    : themeConfig.light.text.primary};
  transition: all 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${props => props.$currentTheme === 'dark'
      ? themeConfig.dark.primaryAccent
      : themeConfig.light.primaryAccent};
    box-shadow: 0 0 0 2px ${props => props.$currentTheme === 'dark'
      ? 'rgba(0, 191, 165, 0.2)'
      : 'rgba(0, 121, 107, 0.2)'};
  }

  &::placeholder {
    color: ${props => props.$currentTheme === 'dark'
      ? themeConfig.dark.text.tertiary
      : themeConfig.light.text.tertiary};
  }
`;

const InputIcon = styled.div<ThemeProps>`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.text.secondary
    : themeConfig.light.text.secondary};
`;

const Button = styled(motion.button)<ThemeProps>`
  width: 100%;
  padding: 1rem;
  background: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.gradients.primary
    : themeConfig.light.gradients.primary};
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ToggleText = styled.p<ThemeProps>`
  text-align: center;
  margin-top: 1.5rem;
  color: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.text.secondary
    : themeConfig.light.text.secondary};

  button {
    color: ${props => props.$currentTheme === 'dark'
      ? themeConfig.dark.primaryAccent
      : themeConfig.light.primaryAccent};
    background: none;
    border: none;
    padding: 0;
    margin-left: 0.5rem;
    cursor: pointer;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorText = styled(motion.p)<ThemeProps>`
  color: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.secondaryAccent
    : themeConfig.light.secondaryAccent};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { theme: currentTheme } = useTheme();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            },
          },
        });
        if (signUpError) throw signUpError;
        
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <AuthContainer
      $currentTheme={currentTheme}
      initial="hidden"
      animate="visible"
      variants={formVariants}
    >
      <Title
        $currentTheme={currentTheme}
        variants={childVariants}
      >
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </Title>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {!isLogin && (
            <InputGroup
              variants={childVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <InputIcon $currentTheme={currentTheme}>
                <User size={20} />
              </InputIcon>
              <Input
                $currentTheme={currentTheme}
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required={!isLogin}
              />
            </InputGroup>
          )}
        </AnimatePresence>

        <InputGroup variants={childVariants}>
          <InputIcon $currentTheme={currentTheme}>
            <Mail size={20} />
          </InputIcon>
          <Input
            $currentTheme={currentTheme}
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </InputGroup>

        <InputGroup variants={childVariants}>
          <InputIcon $currentTheme={currentTheme}>
            <Lock size={20} />
          </InputIcon>
          <Input
            $currentTheme={currentTheme}
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </InputGroup>

        {error && (
          <ErrorText
            $currentTheme={currentTheme}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </ErrorText>
        )}

        <Button
          $currentTheme={currentTheme}
          type="submit"
          disabled={loading}
          variants={childVariants}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              {isLogin ? 'Sign In' : 'Sign Up'}
              <ArrowRight size={20} />
            </>
          )}
        </Button>
      </form>

      <ToggleText $currentTheme={currentTheme}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </ToggleText>
    </AuthContainer>
  );
}; 