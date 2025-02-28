import { useState, useEffect } from "react";
import AppNavigation from "@/components/app-navigation";
import { EphemeraItem } from "@/components/ephemera-item";
import { useUser } from "@/contexts/user-context";

const Realized = () => {
  const { user } = useUser();
  const [realizedEphemera, setRealized] = useState<EphemeraItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRealized = () => {
      try {
        const storedEphemera = localStorage.getItem(`ephemeras-${user?.id}`);
        if (storedEphemera) {
          type TempEphemeraItem = Omit<
            EphemeraItem,
            "createdAt" | "lastInteraction"
          > & {
            createdAt: string | Date;
            lastInteraction: string | Date;
          };
          const parsedEphemera = JSON.parse(storedEphemera).map(
            (ephemera: TempEphemeraItem) => ({
              ...ephemera,
              createdAt: new Date(ephemera.createdAt),
              lastInteraction: new Date(ephemera.lastInteraction),
            })
          );
          setRealized(
            parsedEphemera.filter(
              (ephemera: EphemeraItem) => ephemera.interestLevel >= 80
            )
          );
        }
      } catch (error) {
        console.error("Failed to load realized ephemeras:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRealized();
  }, [user?.id]);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-abbey-950">
      <AppNavigation />
      <div className="flex-1 flex flex-col items-center pt-16">
        <div className="w-full max-w-6xl px-4 sm:px-6">
          <div className="mb-6 text-center py-4">
            <h2 className="text-2xl font-bold text-abbey-900 dark:text-abbey-50">
              実現されたアイデア
            </h2>
            <p className="text-abbey-500 dark:text-abbey-400">
              興味レベルが80%以上のアイデアがここに表示されます。
            </p>
          </div>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center w-full">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-abbey-300 border-t-transparent dark:border-abbey-600 dark:border-t-transparent"></div>
            </div>
          ) : realizedEphemera.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-abbey-200 dark:border-abbey-700 p-8 text-center w-full max-w-4xl mx-auto">
              <h3 className="mb-2 text-xl font-medium text-abbey-800 dark:text-abbey-200">
                まだありません
              </h3>
              <p className="mb-4 text-abbey-500 dark:text-abbey-400">
                アイデアの興味レベルが80%以上になると、ここに表示されます
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full mx-auto pb-8">
              {realizedEphemera.map((ephemera) => (
                <div
                  key={ephemera.id}
                  className="bg-white dark:bg-abbey-800 p-6 rounded-lg shadow-md"
                >
                  <p className="text-lg font-medium text-abbey-900 dark:text-abbey-50">
                    {ephemera.content}
                  </p>
                  <div className="mt-4 text-sm text-abbey-500 dark:text-abbey-400">
                    興味レベル: {ephemera.interestLevel}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Realized;