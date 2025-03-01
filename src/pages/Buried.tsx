import { useState, useEffect } from "react";
import AppNavigation from "@/components/app-navigation";
import BuriedEphemeraItem from "@/components/buried-item";
import { EphemeraItem } from "@/types/ephemera";
import { useUser } from "@/contexts/user-context";
import { loadBuriedEphemera } from "@/lib/utils/ephemera-storage";

const Buried = () => {
  const { user } = useUser();
  const [buriedEphemera, setBuried] = useState<EphemeraItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load buried ephemeras from localStorage
    const loadBuriedData = () => {
      try {
        const buried = loadBuriedEphemera(user?.id);
        setBuried(buried);
      } catch (error) {
        console.error("Failed to load buried ephemeras:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBuriedData();
  }, [user?.id]);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-abbey-950">
      <AppNavigation />
      <div className="flex-1 flex flex-col items-center pt-16">
        <div className="w-full max-w-6xl px-4 sm:px-6">
          <div className="mb-6 text-center py-4">
            <h2 className="text-2xl font-bold text-abbey-900 dark:text-abbey-50">
              Buried
            </h2>
            <p className="text-abbey-500 dark:text-abbey-400">
              Ideas that have returned to the void. They're still here, just
              buried.
            </p>
          </div>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center w-full">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-abbey-300 border-t-transparent dark:border-abbey-600 dark:border-t-transparent"></div>
            </div>
          ) : buriedEphemera.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-abbey-200 dark:border-abbey-700 p-8 text-center w-full max-w-4xl mx-auto">
              <h3 className="mb-2 text-xl font-medium text-abbey-800 dark:text-abbey-200">
                No buried ephemeras yet
              </h3>
              <p className="mb-4 text-abbey-500 dark:text-abbey-400">
                When your ephemeras fade away, they'll appear here
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full mx-auto pb-8">
              {buriedEphemera.map((ephemera) => (
                <BuriedEphemeraItem key={ephemera.id} ephemera={ephemera} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Buried;
