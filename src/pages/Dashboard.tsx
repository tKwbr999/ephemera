import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import AppNavigation from '@/components/app-navigation';
import CloudItem, { CloudItem as CloudItemType } from '@/components/cloud-item';
import CreateCloudDialog from '@/components/create-cloud-dialog';
import { useUser } from '@/contexts/user-context';
import { config } from '@/lib/config';

const Dashboard = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [clouds, setClouds] = useState<CloudItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For demo purposes, we'll load from localStorage
    const loadClouds = () => {
      try {
        const storedClouds = localStorage.getItem(`clouds-${user?.id}`);
        if (storedClouds) {
          const parsedClouds = JSON.parse(storedClouds).map((cloud: any) => ({
            ...cloud,
            createdAt: new Date(cloud.createdAt),
            lastInteraction: new Date(cloud.lastInteraction),
          }));
          setClouds(parsedClouds.filter((cloud: CloudItemType) => cloud.interestLevel > 0));
        }
      } catch (error) {
        console.error('Failed to load clouds:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClouds();

    // Set up interval to decrease interest levels
    const interval = setInterval(() => {
      setClouds((prevClouds) => {
        // Calculate decay rate based on configured lifetime in minutes
        // If lifetime is 43200 minutes (30 days), we want to decrease by 100% over that period
        const totalDecayRate = 100 / config.cloudLifetimeMinutes;
        
        // Convert to per-second rate (divide by seconds in a minute)
        const secondsInMinute = 60;
        const perSecondDecayRate = totalDecayRate / secondsInMinute;
        
        const updatedClouds = prevClouds.map((cloud) => {
          // Decrease interest by the calculated rate per second
          const newInterestLevel = Math.max(0, cloud.interestLevel - perSecondDecayRate);
          return {
            ...cloud,
            interestLevel: newInterestLevel,
          };
        });

        // Filter out clouds with zero interest
        const activeClouds = updatedClouds.filter((cloud) => cloud.interestLevel > 0);
        
        // Save to localStorage
        localStorage.setItem(
          `clouds-${user?.id}`,
          JSON.stringify([
            ...activeClouds,
            ...updatedClouds.filter((cloud) => cloud.interestLevel <= 0),
          ])
        );
        
        return activeClouds;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [user?.id]);

  const handleCreateCloud = (content: string) => {
    const newCloud: CloudItemType = {
      id: crypto.randomUUID(),
      content,
      createdAt: new Date(),
      lastInteraction: new Date(),
      interestLevel: 100,
    };

    setClouds((prevClouds) => {
      const updatedClouds = [...prevClouds, newCloud];
      localStorage.setItem(`clouds-${user?.id}`, JSON.stringify(updatedClouds));
      return updatedClouds;
    });

    toast({
      title: 'Cloud created',
      description: 'Your idea has been added to your clouds.',
    });
  };

  const handleInteract = (id: string) => {
    setClouds((prevClouds) => {
      const updatedClouds = prevClouds.map((cloud) => {
        if (cloud.id === id) {
          return {
            ...cloud,
            interestLevel: 100,
            lastInteraction: new Date(),
          };
        }
        return cloud;
      });

      // Get archived clouds
      const storedClouds = localStorage.getItem(`clouds-${user?.id}`);
      let archivedClouds: CloudItemType[] = [];
      if (storedClouds) {
        const parsedClouds = JSON.parse(storedClouds).map((cloud: any) => ({
          ...cloud,
          createdAt: new Date(cloud.createdAt),
          lastInteraction: new Date(cloud.lastInteraction),
        }));
        archivedClouds = parsedClouds.filter(
          (cloud: CloudItemType) => cloud.interestLevel <= 0
        );
      }

      // Save all clouds to localStorage
      localStorage.setItem(
        `clouds-${user?.id}`,
        JSON.stringify([...updatedClouds, ...archivedClouds])
      );

      return updatedClouds;
    });

    toast({
      title: 'Cloud refreshed',
      description: 'Your interest in this idea has been renewed.',
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-abbey-950">
      <AppNavigation />
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-6xl px-4 sm:px-6">
          <div className="mb-6 text-center py-4">
            <h2 className="text-2xl font-bold text-abbey-900 dark:text-abbey-50">My Idea Clouds</h2>
            <p className="text-abbey-500 dark:text-abbey-400">
              Your private space for ideas. Tap clouds to keep them alive.
            </p>
            <p className="text-sm text-abbey-400 dark:text-abbey-500 mt-1">
              Cloud lifetime: {config.cloudLifetimeDisplay} {config.devMode && "(Dev Mode)"}
            </p>
          </div>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center w-full">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-abbey-300 border-t-transparent dark:border-abbey-600 dark:border-t-transparent"></div>
            </div>
          ) : clouds.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-abbey-200 dark:border-abbey-700 p-8 text-center w-full max-w-4xl mx-auto">
              <h3 className="mb-2 text-xl font-medium text-abbey-800 dark:text-abbey-200">No clouds yet</h3>
              <p className="mb-4 text-abbey-500 dark:text-abbey-400">
                Create your first idea cloud to get started
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full mx-auto pb-8">
              {clouds.map((cloud) => (
                <CloudItem key={cloud.id} cloud={cloud} onInteract={handleInteract} />
              ))}
            </div>
          )}
        </div>
      </div>
      <CreateCloudDialog onCreateCloud={handleCreateCloud} />
    </div>
  );
};

export default Dashboard;