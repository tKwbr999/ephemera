import { differenceInMinutes } from "date-fns";
import { config } from "@/lib/config";
import { EphemeraItem } from "@/types/ephemera";

/**
 * Calculates the interest level of an ephemera item based on time elapsed
 * @param lastInteraction The date of last interaction
 * @returns The interest level as a percentage (0-100)
 */
export const calculateInterestLevel = (lastInteraction: Date): number => {
  // Calculate the elapsed time in minutes since the last interaction
  const elapsedTime = differenceInMinutes(new Date(), lastInteraction);

  // Calculate the lifetime in minutes based on devMode
  const ephemeraLifetime = config.devMode
    ? config.ephemeraLifetimeMinutes
    : config.ephemeraLifetimeString * 24 * 60;

  // Calculate the remaining lifetime in minutes
  const remainingLifetime = ephemeraLifetime - elapsedTime;

  // Calculate the interest level as a percentage
  return Math.max(0, (remainingLifetime / ephemeraLifetime) * 100);
};

/**
 * Calculates the burial depth of an ephemera based on time since buried
 * @param lastInteraction The date when the ephemera was last interacted with
 * @returns A value between 0 and 1 representing burial depth (0 = fresh, 1 = fully buried)
 */
export const calculateBurialDepth = (lastInteraction: Date): number => {
  // Calculate minutes since buried
  const minutesSinceBuried = Math.floor(
    (new Date().getTime() - lastInteraction.getTime()) / (1000 * 60)
  );

  // Calculate how deep the ephemera is buried based on minutes since buried
  // Use the configured lifetime as the basis for maximum burial
  return Math.min(minutesSinceBuried / config.ephemeraLifetimeMinutes, 1);
};

/**
 * Calculates the decay rate per second based on the configured lifetime
 * @returns The decay rate per second
 */
export const calculateDecayRatePerSecond = (): number => {
  // Calculate decay rate based on configured lifetime in minutes
  // If lifetime is 43200 minutes (30 days), we want to decrease by 100% over that period
  const totalDecayRate = 100 / config.ephemeraLifetimeMinutes;

  // Convert to per-second rate (divide by seconds in a minute)
  const secondsInMinute = 60;
  return totalDecayRate / secondsInMinute;
};

/**
 * Updates the interest levels of ephemera items based on the decay rate
 * @param ephemeraItems The array of ephemera items to update
 * @returns A new array with updated interest levels
 */
export const updateEphemeraInterestLevels = (ephemeraItems: EphemeraItem[]): EphemeraItem[] => {
  const perSecondDecayRate = calculateDecayRatePerSecond();
  
  return ephemeraItems.map(ephemera => {
    // Decrease interest by the calculated rate per second
    const newInterestLevel = Math.max(0, ephemera.interestLevel - perSecondDecayRate);
    return {
      ...ephemera,
      interestLevel: newInterestLevel,
    };
  });
};

/**
 * Creates a gradient style object for text based on a value between 0 and 1
 * @param value A value between 0 and 1 (0 = black, 1 = white)
 * @returns A style object for applying a gradient to text
 */
export const createTextGradientStyle = (value: number): React.CSSProperties => {
  return {
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, ${1 - value}), rgba(255, 255, 255, ${value}))`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent",
  };
};
