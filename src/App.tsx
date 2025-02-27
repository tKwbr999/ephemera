import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Ephemera from "@/pages/Ephemera";
import ArchivedClouds from "@/pages/ArchivedClouds";
import ProtectedRoute from "@/components/protected-route";
import { UserProvider } from "@/contexts/user-context";

function App() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      toast({
        title: "Supabase not configured",
        description:
          "Please connect to Supabase from the StackBlitz interface to enable authentication.",
        variant: "destructive",
        duration: 6000,
      });
    }

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-abbey-300 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="cloud-ideas-theme">
      <UserProvider>
        <div className="min-h-screen w-full bg-white max-w-md mx-auto">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/ephemera"
              element={
                <ProtectedRoute>
                  <Ephemera />
                </ProtectedRoute>
              }
            />
            <Route
              path="/archived"
              element={
                <ProtectedRoute>
                  <ArchivedClouds />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/ephemera" replace />} />
          </Routes>
        </div>
        <Toaster />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
