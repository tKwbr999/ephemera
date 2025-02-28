import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Cloud } from "lucide-react";
import DebugModeDisplay from "@/components/DebugModeDisplay";
import { useLogin } from "@/hooks/use-login";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Separator } from "@/components/ui/separator-trisect";

const Login = () => {
  const {
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
  } = useLogin();

  // Check if debug mode is enabled
  const isDebugMode = import.meta.env.VITE_DEBUG === "true";
  const { toast } = useToast();

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!isDebugMode && (!supabaseUrl || !supabaseKey)) {
      toast({
        title: "Supabase not configured",
        description:
          "Please connect to Supabase from the StackBlitz interface to enable authentication.",
        variant: "destructive",
        duration: 6000,
      });
    }
  }, [isDebugMode, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      {isDebugMode && <DebugModeDisplay handleDebugLogin={handleDebugLogin} />}
      <Card className="w-full max-w-md border-abbey-200 dark:border-abbey-700 mx-auto text-center rounded-xl">
        <CardHeader className="space-y-3 flex flex-col items-center">
          <div className="flex justify-center">
            <Cloud className="h-12 w-12 text-abbey-800 dark:text-abbey-800" />
          </div>
          <CardTitle className="text-2xl font-bold text-abbey-900 dark:text-abbey-900">
            Welcome Ephemera
          </CardTitle>
          <CardDescription className="text-abbey-500 dark:text-abbey-500 max-w-xs mx-auto">
            Sign in to access your ephemera ideas
          </CardDescription>
          <Button
            type="button"
            variant="outline"
            className="w-full bg-abbey-900 hover:bg-abbey-800 text-white border-abbey-900 flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isGoogleLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-abbey-400 border-t-transparent"></div>
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path
                    fill="#4285F4"
                    d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                  />
                  <path
                    fill="#34A853"
                    d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                  />
                </g>
              </svg>
            )}
            <span>Continue with Google</span>
          </Button>
        </CardHeader>
        <div className="flex items-center gap-2 py-2 justify-center">
          <Separator />
          <span className="text-abbey-500 dark:text-abbey-500">OR</span>{" "}
          <Separator />
        </div>
        <CardContent className="space-y-4 w-full px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md text-left">
                {loginError}
              </div>
            )}
            <div className="space-y-2 text-left">
              <Label
                htmlFor="email"
                className="text-abbey-700 dark:text-abbey-700"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`border-abbey-200 dark:border-abbey-700 focus-visible:ring-abbey-400 bg-white dark:bg-white text-abbey-900 dark:text-abbey-900 ${
                  loginError ? "border-red-300 focus-visible:ring-red-400" : ""
                }`}
              />
            </div>
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-abbey-700 dark:text-abbey-700"
                >
                  Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`border-abbey-200 dark:border-abbey-700 focus-visible:ring-abbey-400 bg-white dark:bg-white text-abbey-900 dark:text-abbey-900 ${
                  loginError ? "border-red-300 focus-visible:ring-red-400" : ""
                }`}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-abbey-900 hover:bg-abbey-800 text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Log in with Email"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 px-6 pb-6">
          <div className="text-center text-sm text-abbey-600 dark:text-abbey-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-abbey-800 dark:text-abbey-800 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
