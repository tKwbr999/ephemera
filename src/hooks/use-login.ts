import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/user-context";
import { useToast } from "@/hooks/use-toast";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login, loginWithGoogle, isAuthenticated, debugLogin } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if debug mode is enabled
  const isDebugMode = import.meta.env.VITE_DEBUG === "true";

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    setIsSupabaseConfigured((!!supabaseUrl && !!supabaseKey) || isDebugMode);
  }, [isDebugMode]);

  // Add effect to redirect when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/alive");
    }
  }, [isAuthenticated, navigate]);

  // Clear error when email or password changes
  useEffect(() => {
    if (loginError) {
      setLoginError(null);
    }
  }, [email, password, loginError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSupabaseConfigured && !isDebugMode) {
      toast({
        title: "Authentication unavailable",
        description:
          "Please connect to Supabase from the StackBlitz interface first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLoginError(null);

    try {
      await login(email, password);
      toast({
        title: "Success",
        description: "You have successfully logged in.",
      });
      // Redirect will be handled by the useEffect
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during login";
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured && !isDebugMode) {
      toast({
        title: "Authentication unavailable",
        description:
          "Please connect to Supabase from the StackBlitz interface first.",
        variant: "destructive",
      });
      return;
    }

    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      // No need for toast or navigation here as it will redirect to Google
    } catch (error) {
      console.error(error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleDebugLogin = () => {
    debugLogin();
    // Redirect will be handled by the useEffect
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    isGoogleLoading,
    loginError,
    handleSubmit,
    handleGoogleLogin,
    handleDebugLogin,
  };
};
