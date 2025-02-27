import { useState, useEffect } from 'react';
import AppNavigation from '@/components/app-navigation';
import ArchivedCloudItem from '@/components/archived-cloud-item';
import { CloudItem } from '@/components/cloud-item';
import { useUser } from '@/contexts/user-context';

const ArchivedClouds = () => {
  const { user } = useUser();
  const [archivedClouds, setArchivedClouds] = useState<CloudItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For demo purposes, we'll load from localStorage
    const loadArchivedClouds = () => {
      try {
        const storedClouds = localStorage.getItem(`clouds-${user?.id}`);
        if (storedClouds) {
          const parsedClouds = JSON.parse(storedClouds).map((cloud: any) => ({
            ...cloud,
            createdAt: new Date(cloud.createdAt),
            lastInteraction: new Date(cloud.lastInteraction),
          }));
          setArchivedClouds(parsedClouds.filter((cloud: CloudItem) => cloud.interestLevel <= 0));
        }
      } catch (error) {
        console.error('Failed to load archived clouds:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArchivedClouds();
  }, [user?.id]);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-abbey-950">
      <AppNavigation />
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-6xl px-4 sm:px-6">
          <div className="mb-6 text-center py-4">
            <h2 className="text-2xl font-bold text-abbey-900 dark:text-abbey-50">Archived Clouds</h2>
            <p className="text-abbey-500 dark:text-abbey-400">
              Ideas that have returned to the earth. They're still here, just buried.
            </p>
          </div>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center w-full">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-abbey-300 border-t-transparent dark:border-abbey-600 dark:border-t-transparent"></div>
            </div>
          ) : archivedClouds.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-abbey-200 dark:border-abbey-700 p-8 text-center w-full max-w-4xl mx-auto">
              <h3 className="mb-2 text-xl font-medium text-abbey-800 dark:text-abbey-200">No archived clouds</h3>
              <p className="mb-4 text-abbey-500 dark:text-abbey-400">
                When your ideas fade away, they'll appear here
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full mx-auto pb-8">
              {archivedClouds.map((cloud) => (
                <ArchivedCloudItem key={cloud.id} cloud={cloud} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchivedClouds;