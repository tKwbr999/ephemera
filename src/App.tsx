import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Ephemera from "@/pages/Ephemera";
import Realized from "@/pages/Realized";
import Buried from "@/pages/Buried";
import ProtectedRoute from "@/components/protected-route";
import { UserProvider } from "@/contexts/user-context";

function App() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Check if debug mode is enabled
  const isDebugMode = import.meta.env.VITE_DEBUG === "true";

  useEffect(() => {
    // Check if Supabase is configured - only show warning if not in debug mode
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

    if (isDebugMode) {
      toast({
        title: "Debug Mode Active",
        description:
          "Authentication will be simulated. Use the debug login button.",
        duration: 4000,
      });
    }

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [toast, isDebugMode]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-abbey-300 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="ephemera-ideas-theme">
      <UserProvider>
        <div className="min-h-screen w-full bg-white">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/realized"
              element={
                <ProtectedRoute>
                  <Realized />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alive"
              element={
                <ProtectedRoute>
                  <Ephemera />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buried"
              element={
                <ProtectedRoute>
                  <Buried />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
        <Toaster />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
