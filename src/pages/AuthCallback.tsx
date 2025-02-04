import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LuxuryLoader } from '@/components/LuxuryLoader';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        
        // If there's no error, the user is confirmed and logged in
        if (!error) {
          // Get user profile to check if admin
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('is_admin')
              .eq('id', session.user.id)
              .single();

            // Redirect to appropriate page
            if (profile?.is_admin) {
              window.location.href = 'https://www.customprint.co.in/admin';
            } else {
              window.location.href = 'https://www.customprint.co.in';
            }
          }
        } else {
          window.location.href = 'https://www.customprint.co.in/login';
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        window.location.href = 'https://www.customprint.co.in/login';
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  return <LuxuryLoader />;
} 