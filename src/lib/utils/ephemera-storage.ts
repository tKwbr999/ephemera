import { EphemeraItem } from "@/types/ephemera";

/**
 * Loads ephemera items from localStorage for a specific user
 * @param userId The user ID
 * @returns An array of EphemeraItem objects
 */
export const loadEphemeraItems = (userId?: string): EphemeraItem[] => {
  if (!userId) return [];
  
  try {
    const storedEphemera = localStorage.getItem(`ephemeras-${userId}`);
    if (!storedEphemera) return [];
    
    const parsedEphemera = JSON.parse(storedEphemera).map(
      (ephemera: any) => ({
        ...ephemera,
        createdAt: new Date(ephemera.createdAt),
        lastInteraction: new Date(ephemera.lastInteraction),
      })
    );
    
    return parsedEphemera;
  } catch (error) {
    console.error("Failed to load ephemeras:", error);
    return [];
  }
};

/**
 * Loads active ephemera items (interest level > 0) from localStorage
 * @param userId The user ID
 * @returns An array of active EphemeraItem objects
 */
export const loadActiveEphemera = (userId?: string): EphemeraItem[] => {
  const allEphemera = loadEphemeraItems(userId);
  return allEphemera.filter(ephemera => ephemera.interestLevel > 0);
};

/**
 * Loads buried ephemera items (interest level <= 0) from localStorage
 * @param userId The user ID
 * @returns An array of buried EphemeraItem objects
 */
export const loadBuriedEphemera = (userId?: string): EphemeraItem[] => {
  const allEphemera = loadEphemeraItems(userId);
  return allEphemera.filter(ephemera => ephemera.interestLevel <= 0);
};

/**
 * Saves ephemera items to localStorage
 * @param userId The user ID
 * @param ephemeraItems An array of EphemeraItem objects to save
 */
export const saveEphemeraItems = (userId?: string, ephemeraItems: EphemeraItem[] = []): void => {
  if (!userId) return;
  
  try {
    localStorage.setItem(`ephemeras-${userId}`, JSON.stringify(ephemeraItems));
  } catch (error) {
    console.error("Failed to save ephemeras:", error);
  }
};

/**
 * Creates a new ephemera item
 * @param content The content of the ephemera
 * @returns A new EphemeraItem object
 */
export const createEphemeraItem = (content: string): EphemeraItem => {
  return {
    id: crypto.randomUUID(),
    content,
    createdAt: new Date(),
    lastInteraction: new Date(),
    interestLevel: 100,
  };
};

/**
 * Refreshes an ephemera item's interest level
 * @param ephemeraItems The array of ephemera items
 * @param id The ID of the ephemera to refresh
 * @returns A new array with the refreshed ephemera
 */
export const refreshEphemeraItem = (ephemeraItems: EphemeraItem[], id: string): EphemeraItem[] => {
  return ephemeraItems.map(ephemera => {
    if (ephemera.id === id) {
      return {
        ...ephemera,
        interestLevel: 100,
        lastInteraction: new Date(),
      };
    }
    return ephemera;
  });
};
