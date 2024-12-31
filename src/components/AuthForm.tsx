import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

const AuthForm = () => {
  return (
    <div className="max-w-md w-full mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-xl">
      <h2 className="text-3xl font-serif text-center mb-8 text-primary">Welcome to Label Naves</h2>
      <div className="space-y-4">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#9b87f5',
                  brandAccent: '#7E69AB',
                  inputBackground: 'white',
                },
                borderWidths: {
                  buttonBorderWidth: '1px',
                  inputBorderWidth: '1px',
                },
                radii: {
                  borderRadiusButton: '0.5rem',
                  inputBorderRadius: '0.5rem',
                },
              },
            },
            style: {
              button: {
                padding: '10px 15px',
                fontSize: '16px',
              },
              input: {
                padding: '10px 15px',
              },
              anchor: {
                color: '#7E69AB',
              },
            },
          }}
          providers={[]}
          redirectTo={`${window.location.origin}/admin`}
          onlyThirdPartyProviders={false}
          magicLink={false}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Sign In',
              },
            },
          }}
        />
      </div>
      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>Admin Login:</p>
        <p>Email: admin@labelnaves.com</p>
        <p>Password: Admin123!</p>
      </div>
    </div>
  );
};

export default AuthForm;