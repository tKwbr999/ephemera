import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function useAppInit() {
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

  return { isLoading };
}
