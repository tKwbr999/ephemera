import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/user-context";
import { useToast } from "@/hooks/use-toast";

export const useRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(true);
  const { register, loginWithGoogle } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    setIsSupabaseConfigured(!!supabaseUrl && !!supabaseKey);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSupabaseConfigured) {
      toast({
        title: "Authentication unavailable",
        description:
          "Please connect to Supabase from the StackBlitz interface first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, name);
      toast({
        title: "Success",
        description: "Your account has been created.",
      });
      navigate("/alive");
    } catch (error: unknown) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured) {
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
    } catch (error: unknown) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during Google login.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    isLoading,
    isGoogleLoading,
    handleSubmit,
    handleGoogleLogin,
  };
};
