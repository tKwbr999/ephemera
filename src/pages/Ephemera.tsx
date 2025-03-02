import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import AppNavigation from "@/components/app-navigation";
import EphemeraItemComponent, { EphemeraItem } from "@/components/ephemera-item";
import CreateEphemeraDialog from "@/components/create-ephemera-dialog";
import { useUser } from "@/contexts/user-context";
import { config } from "@/lib/config";
import { 
  loadActiveEphemera, 
  saveEphemeraItems, 
  createEphemeraItem, 
  refreshEphemeraItem, 
  loadBuriedEphemera 
} from "@/lib/utils/ephemera-storage";
import { updateEphemeraInterestLevels } from "@/lib/utils/ephemera-calculator";

const Ephemera = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [ephemeras, setEphemera] = useState<EphemeraItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load ephemeras from localStorage
    const loadEphemeraData = () => {
      try {
        const activeEphemera = loadActiveEphemera(user?.id);
        setEphemera(activeEphemera);
      } catch (error) {
        console.error("Failed to load ephemeras:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEphemeraData();

    // Set up interval to decrease interest levels
    const interval = setInterval(() => {
      setEphemera((prevEphemera) => {
        // Update interest levels based on decay rate
        const updatedEphemera = updateEphemeraInterestLevels(prevEphemera);
        
        // Filter out ephemeras with zero interest
        const activeEphemera = updatedEphemera.filter(
          (ephemera) => ephemera.interestLevel > 0
        );

        // Get buried ephemeras
        const buriedEphemera = loadBuriedEphemera(user?.id);
        
        // Add newly buried ephemeras to the buried list
        const newlyBuried = updatedEphemera.filter(
          (ephemera) => ephemera.interestLevel <= 0
        );
        
        // Save all ephemeras to localStorage
        saveEphemeraItems(user?.id, [
          ...activeEphemera,
          ...buriedEphemera,
          ...newlyBuried
        ]);

        return activeEphemera;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [user?.id]);

  const handleCreateEphemera = (content: string) => {
    const newEphemera = createEphemeraItem(content);

    setEphemera((prevEphemera) => {
      const updatedEphemera = [...prevEphemera, newEphemera];
      // Get buried ephemeras
      const buriedEphemera = loadBuriedEphemera(user?.id);
      
      // Save all ephemeras to localStorage
      saveEphemeraItems(user?.id, [...updatedEphemera, ...buriedEphemera]);
      return updatedEphemera;
    });

    toast({
      title: "Ephemera created",
      description: "Your idea has been added to your ephemeras.",
    });
  };

  const handleInteract = (id: string) => {
    setEphemera((prevEphemera) => {
      // Refresh the interest level of the ephemera
      const updatedEphemera = refreshEphemeraItem(prevEphemera, id);
      
      // Get buried ephemeras
      const buriedEphemera = loadBuriedEphemera(user?.id);
      
      // Save all ephemeras to localStorage
      saveEphemeraItems(user?.id, [...updatedEphemera, ...buriedEphemera]);
      
      return updatedEphemera;
    });

    toast({
      title: "Ephemera refreshed",
      description: "Your interest in this idea has been renewed.",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-abbey-950">
      <AppNavigation />
      <div className="flex-1 flex flex-col items-center pt-16">
        <div className="w-full max-w-6xl px-4 sm:px-6">
          <div className="mb-6 text-center py-4">
            <h2 className="text-2xl font-bold text-abbey-900 dark:text-abbey-50">
              Alive
            </h2>
            <p className="text-abbey-500 dark:text-abbey-400">
              Your private space for ideas. Tap ephemeras to keep them alive.
            </p>
            <p className="text-sm text-abbey-400 dark:text-abbey-500 mt-1">
              Ephemera lifetime: {config.ephemeraLifetimeDisplay}{" "}
              {config.devMode && "(Dev Mode)"}
            </p>
          </div>

          <CreateEphemeraDialog onCreateEphemera={handleCreateEphemera} />

          {isLoading ? (
            <div className="flex h-40 items-center justify-center w-full">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-abbey-300 border-t-transparent dark:border-abbey-600 dark:border-t-transparent"></div>
            </div>
          ) : ephemeras.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-abbey-200 dark:border-abbey-700 p-8 text-center w-full max-w-4xl mx-auto">
              <h3 className="mb-2 text-xl font-medium text-abbey-800 dark:text-abbey-200">
                No ephemeras yet
              </h3>
              <p className="mb-4 text-abbey-500 dark:text-abbey-400">
                Create your first ephemera to get started
              </p>
            </div>
          ) : (
            <div className="w-full max-w-4xl mx-auto">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-8">
                {ephemeras.map((ephemera) => (
                  <EphemeraItemComponent
                    key={ephemera.id}
                    ephemera={ephemera}
                    onInteract={handleInteract}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ephemera;
