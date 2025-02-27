import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '@/contexts/user-context';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Cloud } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login, loginWithGoogle } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    setIsSupabaseConfigured(!!supabaseUrl && !!supabaseKey);
  }, []);

  // Clear error when email or password changes
  useEffect(() => {
    if (loginError) {
      setLoginError(null);
    }
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSupabaseConfigured) {
      toast({
        title: "Authentication unavailable",
        description: "Please connect to Supabase from the StackBlitz interface first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setLoginError(null);

    try {
      await login(email, password);
      toast({
        title: 'Success',
        description: 'You have successfully logged in.',
      });
      navigate('/dashboard');
    } catch (error: any) {
      setLoginError(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured) {
      toast({
        title: "Authentication unavailable",
        description: "Please connect to Supabase from the StackBlitz interface first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      // No need for toast or navigation here as it will redirect to Google
    } catch (error) {
      // Error is handled in the loginWithGoogle function
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-white p-4">
      <Card className="w-full max-w-md border-abbey-200 dark:border-abbey-700 mx-auto text-center rounded-xl">
        <CardHeader className="space-y-3 flex flex-col items-center">
          <div className="flex justify-center">
            <Cloud className="h-12 w-12 text-abbey-800 dark:text-abbey-800" />
          </div>
          <CardTitle className="text-2xl font-bold text-abbey-900 dark:text-abbey-900">Welcome back</CardTitle>
          <CardDescription className="text-abbey-500 dark:text-abbey-500 max-w-xs mx-auto">
            Sign in to access your cloud ideas
          </CardDescription>
          {!isSupabaseConfigured && (
            <div className="mt-2 text-sm text-red-500 bg-red-50 p-2 rounded-md">
              Please connect to Supabase from the StackBlitz interface to enable authentication.
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4 w-full px-6">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full border-abbey-200 dark:border-abbey-700 text-abbey-800 hover:bg-abbey-50 flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || !isSupabaseConfigured}
          >
            {isGoogleLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-abbey-400 border-t-transparent"></div>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                </g>
              </svg>
            )}
            <span>Continue with Google</span>
          </Button>

          <div className="flex items-center gap-2 py-2">
            <Separator className="flex-grow bg-abbey-200 dark:bg-abbey-700" />
            <span className="text-xs text-abbey-500 dark:text-abbey-500">OR</span>
            <Separator className="flex-grow bg-abbey-200 dark:bg-abbey-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md text-left">
                {loginError}
              </div>
            )}
            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="text-abbey-700 dark:text-abbey-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`border-abbey-200 dark:border-abbey-700 focus-visible:ring-abbey-400 bg-white dark:bg-white text-abbey-900 dark:text-abbey-900 ${loginError ? 'border-red-300 focus-visible:ring-red-400' : ''}`}
              />
            </div>
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-abbey-700 dark:text-abbey-700">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`border-abbey-200 dark:border-abbey-700 focus-visible:ring-abbey-400 bg-white dark:bg-white text-abbey-900 dark:text-abbey-900 ${loginError ? 'border-red-300 focus-visible:ring-red-400' : ''}`}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-abbey-800 hover:bg-abbey-900 text-white" 
              disabled={isLoading || !isSupabaseConfigured}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                'Log in with Email'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 px-6 pb-6">
          <div className="text-center text-sm text-abbey-600 dark:text-abbey-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-abbey-800 dark:text-abbey-800 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;