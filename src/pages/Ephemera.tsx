import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import AppNavigation from "@/components/app-navigation";
import EphemeraItem, {
  EphemeraItem as EphemeraItemType,
} from "@/components/ephemera-item";
import CreateEphemeraDialog from "@/components/create-ephemera-dialog";
import { useUser } from "@/contexts/user-context";
import { config } from "@/lib/config";

const Ephemera = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [ephemeras, setEphemera] = useState<EphemeraItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For demo purposes, we'll load from localStorage
    const loadEphemera = () => {
      try {
        const storedEphemera = localStorage.getItem(`ephemeras-${user?.id}`);
        if (storedEphemera) {
          const parsedEphemera = JSON.parse(storedEphemera).map(
            (ephemera: EphemeraItemType) => ({
              ...ephemera,
              createdAt: new Date(ephemera.createdAt),
              lastInteraction: new Date(ephemera.lastInteraction),
            })
          );
          setEphemera(
            parsedEphemera.filter(
              (ephemera: EphemeraItemType) => ephemera.interestLevel > 0
            )
          );
        }
      } catch (error) {
        console.error("Failed to load ephemeras:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEphemera();

    // Set up interval to decrease interest levels
    const interval = setInterval(() => {
      setEphemera((prevEphemera) => {
        // Calculate decay rate based on configured lifetime in minutes
        // If lifetime is 43200 minutes (30 days), we want to decrease by 100% over that period
        const totalDecayRate = 100 / config.ephemeraLifetimeMinutes;

        // Convert to per-second rate (divide by seconds in a minute)
        const secondsInMinute = 60;
        const perSecondDecayRate = totalDecayRate / secondsInMinute;

        const updatedEphemera = prevEphemera.map((ephemera) => {
          // Decrease interest by the calculated rate per second
          const newInterestLevel = Math.max(
            0,
            ephemera.interestLevel - perSecondDecayRate
          );
          return {
            ...ephemera,
            interestLevel: newInterestLevel,
          };
        });

        // Filter out ephemeras with zero interest
        const activeEphemera = updatedEphemera.filter(
          (ephemera) => ephemera.interestLevel > 0
        );

        // Save to localStorage
        localStorage.setItem(
          `ephemeras-${user?.id}`,
          JSON.stringify([
            ...activeEphemera,
            ...updatedEphemera.filter(
              (ephemera) => ephemera.interestLevel <= 0
            ),
          ])
        );

        return activeEphemera;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [user?.id]);

  const handleCreateEphemera = (content: string) => {
    const newEphemera: EphemeraItemType = {
      id: crypto.randomUUID(),
      content,
      createdAt: new Date(),
      lastInteraction: new Date(),
      interestLevel: 100,
    };

    setEphemera((prevEphemera) => {
      const updatedEphemera = [...prevEphemera, newEphemera];
      localStorage.setItem(
        `ephemeras-${user?.id}`,
        JSON.stringify(updatedEphemera)
      );
      return updatedEphemera;
    });

    toast({
      title: "Ephemera created",
      description: "Your idea has been added to your ephemeras.",
    });
  };

  const handleInteract = (id: string) => {
    setEphemera((prevEphemera) => {
      const updatedEphemera = prevEphemera.map((ephemera) => {
        if (ephemera.id === id) {
          return {
            ...ephemera,
            interestLevel: 100,
            lastInteraction: new Date(),
          };
        }
        return ephemera;
      });

      // Get buried ephemeras
      const storedEphemera = localStorage.getItem(`ephemeras-${user?.id}`);
      let buriedEphemera: EphemeraItemType[] = [];
      if (storedEphemera) {
        const parsedEphemera = JSON.parse(storedEphemera).map(
          (ephemera: EphemeraItemType) => ({
            ...ephemera,
            createdAt: new Date(ephemera.createdAt),
            lastInteraction: new Date(ephemera.lastInteraction),
          })
        );
        buriedEphemera = parsedEphemera.filter(
          (ephemera: EphemeraItemType) => ephemera.interestLevel <= 0
        );
      }

      // Save all ephemeras to localStorage
      localStorage.setItem(
        `ephemeras-${user?.id}`,
        JSON.stringify([...updatedEphemera, ...buriedEphemera])
      );

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
      <div className="flex-1 flex flex-col items-center">
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
                  <EphemeraItem
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
