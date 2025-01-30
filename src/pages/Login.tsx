import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styled from 'styled-components';
import { supabase } from "@/integrations/supabase/client";
import { LuxuryLoader } from "@/components/LuxuryLoader";
import { AuthForm } from "@/components/auth/AuthForm";
import { useTheme } from "@/hooks/useTheme";
import { theme as themeConfig } from '@/styles/theme';

interface ThemeProps {
  $currentTheme: 'light' | 'dark';
}

const PageContainer = styled(motion.div)<ThemeProps>`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  background: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.background
    : themeConfig.light.background};
`;

const BackgroundGradient = styled(motion.div)<ThemeProps>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.$currentTheme === 'dark'
    ? `linear-gradient(45deg, 
      ${themeConfig.dark.surface} 0%, 
      ${themeConfig.dark.elevatedSurface} 50%,
      ${themeConfig.dark.surface} 100%)`
    : `linear-gradient(45deg, 
      ${themeConfig.light.surface} 0%, 
      ${themeConfig.light.elevatedSurface} 50%,
      ${themeConfig.light.surface} 100%)`};
  opacity: 0.8;
`;

const FloatingShape = styled(motion.div)<ThemeProps & { $size: number; $opacity: number }>`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border-radius: 50%;
  background: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.primaryAccent
    : themeConfig.light.primaryAccent};
  opacity: ${props => props.$opacity};
  filter: blur(50px);
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { theme: currentTheme } = useTheme();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();

          if (profile?.is_admin) {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        setLoading(false);
      }
    };

    void checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        localStorage.removeItem('supabase.auth.token');
        
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();
            
          if (error) throw error;
          
          if (profile?.is_admin) {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error('Error checking profile:', error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return <LuxuryLoader />;
  }

  return (
    <PageContainer
      $currentTheme={currentTheme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <BackgroundGradient
        $currentTheme={currentTheme}
        animate={{
          background: [
            'linear-gradient(45deg, rgba(0,191,165,0.1) 0%, rgba(0,229,255,0.1) 100%)',
            'linear-gradient(225deg, rgba(0,191,165,0.1) 0%, rgba(0,229,255,0.1) 100%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Animated floating shapes */}
      <FloatingShape
        $currentTheme={currentTheme}
        $size={300}
        $opacity={0.1}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{ top: '20%', left: '10%' }}
      />
      <FloatingShape
        $currentTheme={currentTheme}
        $size={200}
        $opacity={0.08}
        animate={{
          x: [0, -70, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{ bottom: '20%', right: '10%' }}
      />
      <FloatingShape
        $currentTheme={currentTheme}
        $size={150}
        $opacity={0.05}
        animate={{
          x: [0, 50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{ top: '60%', left: '30%' }}
      />

      <ContentWrapper
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <AuthForm />
      </ContentWrapper>
    </PageContainer>
  );
};

export default Login;