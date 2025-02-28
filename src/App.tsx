import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/contexts/user-context";
import { useAppInit } from "@/hooks/use-app-init";
import { AppRoutes } from "@/routes";

function App() {
  const { isLoading } = useAppInit();

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
          <AppRoutes />
        </div>
        <Toaster />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
