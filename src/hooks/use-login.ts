import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/user-context";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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

  // 認証状態に基づくリダイレクト処理 - isAuthenticatedが変わった時のみ実行
  useEffect(() => {
    // 認証状態がセットされていない場合は何もしない
    if (!isAuthenticated) return;
    
    // すでに適切なページにいる場合はリダイレクトしない
    if (window.location.pathname === '/alive') return;
    
    // 認証状態がセットされている場合はメインページにリダイレクト
    console.log('認証済みです。aliveページにリダイレクトします');
    // window.locationではなくreact-routerのnavigationを使用
    navigate('/alive');
  }, [isAuthenticated, navigate]);
  
  // 認証の必要なページアクセス時のリダイレクト処理
  useEffect(() => {
    // ログインページか登録ページにいる場合はチェックしない
    if (window.location.pathname === '/login' || window.location.pathname === '/register') {
      return;
    }
    
    // aliveページにアクセスしており、済みの認証がない場合
    if (window.location.pathname === '/alive' && !isAuthenticated) {
      // 即座にチェックしないように、ローカルストレージも確認
      const localAuthState = localStorage.getItem('ephemera_auth_state');
      if (localAuthState === 'authenticated') {
        // ローカルに認証情報がある場合は、セッションを再確認
        const checkSession = async () => {
          try {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
              // 有効なセッションがない場合はログインページに遷移
              console.log('有効なセッションがありません。ログインページにリダイレクトします');
              localStorage.removeItem('ephemera_auth_state');
              navigate('/login');
            }
          } catch (error) {
            console.error('セッション確認エラー:', error);
          }
        };
        checkSession();
      } else {
        // ローカルに認証情報がない場合はログインページにリダイレクト
        console.log('非認証状態です。ログインページにリダイレクトします');
        navigate('/login');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname, isAuthenticated]);
  
  // URLクエリパラメータからの認証確認 - 初回のみ実行
  useEffect(() => {
    // 現在のURLパラメータを確認
    const params = new URLSearchParams(window.location.search);
    const hasAuthParams = ['access_token', 'refresh_token', 'provider', 'code'].some(param => 
      params.has(param)
    );
    
    // 認証パラメータがなければ処理しない
    if (!hasAuthParams) {
      return;
    }
    
    const checkAuthRedirect = async () => {
      try {
        console.log('認証リダイレクトパラメータを検知');
        
        // セッションを確認
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          console.log('有効なセッションを確認しました');
          localStorage.setItem('ephemera_auth_state', 'authenticated');
          // 古い認証パラメータをクリア
          localStorage.removeItem('ephemera_auth_pending');
          // URLパラメータをクリアしてからリダイレクト
          const cleanPath = window.location.pathname; 
          window.history.replaceState({}, document.title, cleanPath);
          // 正しいページにリダイレクト
          if (cleanPath !== '/alive') {
            window.location.href = '/alive';
          }
        }
      } catch (error) {
        console.error('リダイレクトパラメータチェックエラー:', error);
      }
    };
    
    checkAuthRedirect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 依存配列が空なので初回マウント時のみ実行

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
      console.log('Googleログインを開始します...');
      // SupabaseのGoogle認証を呼び出し
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/alive`,
          scopes: "email profile",
          queryParams: {
            access_type: "offline"
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.url) {
        console.log('Google認証ページにリダイレクトします');
        // ローカルストレージに認証中状態を記録
        localStorage.setItem('ephemera_auth_pending', 'true');
        // パラメータをクリアしたパスで認証ページに移動
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Googleログインエラー:", error);
      // エラーが発生した場合のみトーストを表示
      toast({
        title: "Googleログイン失敗",
        description: error instanceof Error 
          ? error.message 
          : "Googleログインに失敗しました。プロバイダー設定を確認してください。",
        variant: "destructive",
      });
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
