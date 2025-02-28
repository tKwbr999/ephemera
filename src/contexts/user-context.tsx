import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  session: Session | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  // Check for VITE_DEBUG flag outside useEffect
  const isDebugMode = import.meta.env.VITE_DEBUG === "true";

  useEffect(() => {
    // Get the initial session
    if (isDebugMode) {
      setIsAuthenticated(true);
      setUser({
        id: "debug-user",
        email: "debug@example.com",
        name: "Debug User",
      });
    } else {
      supabase.auth
        .getSession()
        .then(
          ({ data: { session } }: { data: { session: Session | null } }) => {
            setSession(session);
            setIsAuthenticated(!!session);
            if (session?.user) {
              setUserFromSupabaseUser(session.user);
            }
          }
        )
        .catch((error: unknown) => {
          console.warn("Error getting session:", error);
        });

      try {
        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(
          (_event: string, session: Session | null) => {
            setSession(session);
            setIsAuthenticated(!!session);
            if (session?.user) {
              setUserFromSupabaseUser(session.user);
            } else {
              setUser(null);
            }
          }
        );

        return () => {
          subscription?.unsubscribe();
        };
      } catch (error: unknown) {
        console.warn("Error setting up auth state change listener:", error);
        return () => {};
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setUserFromSupabaseUser = (supabaseUser: SupabaseUser) => {
    const userData: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      name:
        supabaseUser.user_metadata?.name ||
        supabaseUser.email?.split("@")[0] ||
        "",
      avatar_url: supabaseUser.user_metadata?.avatar_url || undefined,
    };
    setUser(userData);
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          throw new Error("Email or password is incorrect. Please try again.");
        }
        throw error;
      }

      // Immediately update local state after successful login
      if (data.session) {
        setSession(data.session);
        setIsAuthenticated(true);
        if (data.user) {
          setUserFromSupabaseUser(data.user);
        }
      }
    } catch (error: unknown) {
      toast({
        title: "Login failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/alive",
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: unknown) {
      toast({
        title: "Google login failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during Google login",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split("@")[0],
          },
        },
      });

      if (error) {
        throw error;
      }

      // Update state after successful registration
      if (data.session) {
        setSession(data.session);
        setIsAuthenticated(true);
        if (data.user) {
          setUserFromSupabaseUser(data.user);
        }
      }
    } catch (error: unknown) {
      toast({
        title: "Registration failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during registration",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear state before actual logout
      setUser(null);
      setIsAuthenticated(false);
      setSession(null);

      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error: unknown) {
      toast({
        title: "Logout failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        loginWithGoogle,
        register,
        logout,
        session,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
