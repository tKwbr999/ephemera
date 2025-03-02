import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
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
  debugLogin: () => void; // New debug login function
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

  // Check for VITE_DEBUG flag
  const isDebugMode = import.meta.env.VITE_DEBUG === "true";

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

  // 初回の認証セッション確認
  useEffect(() => {
    const checkAuthSession = async () => {
      try {
        // デバッグモードでも認証セッションをチェック
        if (isSupabaseConfigured()) {
          console.log("初期認証セッションを確認中...");
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("セッション取得エラー:", error);
            return;
          }
          
          const { session } = data;
          
          // セッションに基づいて認証状態を更新
          setSession(session);
          setIsAuthenticated(!!session);
          
          if (session?.user) {
            setUserFromSupabaseUser(session.user);
            console.log("認証済みユーザー:", session.user.email);
            // ローカルストレージにセッション情報を一時保存（セキュリティに注意）
            localStorage.setItem('ephemera_auth_state', 'authenticated');
          } else {
            console.log("アクティブセッションがありません");
            localStorage.removeItem('ephemera_auth_state');
            setUser(null);
          }
        }
      } catch (err) {
        console.error("認証チェックエラー:", err);
      }
    };
    
    // 初期認証チェックを実行
    checkAuthSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // オンライン状態の監視
  useEffect(() => {
    const handleOnline = () => {
      // オンラインになった時に認証セッションを再確認
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          setSession(data.session);
          setIsAuthenticated(true);
          setUserFromSupabaseUser(data.session.user);
        }
      });
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // 認証状態の変化を監視
  useEffect(() => {
    // リスナー登録のための関数
    const setupAuthListener = () => {
      try {
        // デバッグモードに関わらずリスナーを設定
        if (isSupabaseConfigured()) {
          console.log('認証状態変更リスナーを登録します');
          
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange(
            (event: string, session: Session | null) => {
              console.log(`認証状態変更イベント: ${event}`);
              
              // セッション状態を更新
              setSession(session);
              setIsAuthenticated(!!session);
              
              if (session?.user) {
                setUserFromSupabaseUser(session.user);
                // ローカルストレージに認証状態を保存
                localStorage.setItem('ephemera_auth_state', 'authenticated');
                
                // ログイン成功時のトースト
                if (event === 'SIGNED_IN') {
                  toast({
                    title: "ログイン成功",
                    description: `${session.user.email || 'ユーザー'}としてログインしました`,
                    variant: "default",
                  });
                }
              } else {
                setUser(null);
                localStorage.removeItem('ephemera_auth_state');
              }
              
              // イベントによるリダイレクト処理 - メインスレッドをブロックしないように非同期で処理
              setTimeout(() => {
                switch (event) {
                  case 'SIGNED_IN':
                    console.log('認証成功しました: SIGNED_IN');
                    // ログインページにいる場合はリダイレクト
                    if (window.location.pathname === '/login' || window.location.pathname === '/register') {
                      window.location.href = '/alive';
                    }
                    break;
                  
                  case 'SIGNED_OUT':
                    console.log('ログアウトしました: SIGNED_OUT');
                    // aliveページにいる場合はログインページにリダイレクト
                    if (window.location.pathname === '/alive') {
                      window.location.href = '/login';
                    }
                    break;
                }
              }, 0);
            }
          );

          return () => {
            subscription?.unsubscribe();
          };
        }
      } catch (error) {
        console.warn("認証状態リスナー設定エラー:", error);
      }
      
      return undefined;
    };
    
    // リスナーを設定
    const unsubscribe = setupAuthListener();
    
    // クリーンアップ関数
    return () => {
      if (unsubscribe) unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debug login function
  const debugLogin = () => {
    if (isDebugMode) {
      setIsAuthenticated(true);
      setUser({
        id: "debug-user",
        email: "debug@example.com",
        name: "Debug User",
      });
      toast({
        title: "Debug mode",
        description: "Logged in as Debug User without authentication",
      });
    } else {
      toast({
        title: "Debug mode not enabled",
        description: "Cannot use debug login in production mode",
        variant: "destructive",
      });
    }
  };

  const login = async (email: string, password: string) => {
    // 通常のログイン処理
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
    // 通常のGoogleログイン処理
    try {
      // Check if Supabase is properly configured
      if (!isSupabaseConfigured()) {
        throw new Error("Supabase is not properly configured. Please check your environment variables.");
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/alive`, // 明示的なURL形式
          // Add scopes for additional Google API access if needed
          scopes: "email profile", 
          // You can add additional query parameters if needed
          queryParams: {
            access_type: "offline", // Gets a refresh token
            // prompt: "consent" を削除（初回認証時のみ同意を求める）
          }
        },
      });

      if (error) {
        throw error;
      }

      // The authentication will redirect to Google for OAuth flow
      // and will return to the redirectUrl specified above
      // No need to manually update state here as the onAuthStateChange listener
      // will handle this when the user is redirected back
      
      return data;
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
    // 通常のユーザー登録処理
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

      // デバッグモードでもSupabaseからのログアウトを試みる
      // 認証されていない場合はエラーにならない
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
        debugLogin, // Expose the debug login function
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
