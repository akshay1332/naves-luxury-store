import AuthForm from "@/components/AuthForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LuxuryLoader } from "@/components/LuxuryLoader";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Clear any existing tokens from localStorage
        localStorage.removeItem('supabase.auth.token');
        
        supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile?.is_admin) {
              navigate('/admin');
            } else {
              navigate('/');
            }
          })
          .catch(console.error);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return <LuxuryLoader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm />
    </div>
  );
};

export default Login;