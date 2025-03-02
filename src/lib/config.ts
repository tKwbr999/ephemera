// Configuration values from environment variables
const isDebug = import.meta.env.VITE_DEBUG === "true";

/**
 * Parse the ephemera lifetime value from environment variables
 * @returns The ephemera lifetime in minutes
 */
const parseEphemeraLifetime = (): number => {
  try {
    // Choose the appropriate environment variable based on dev mode
    const lifetimeValue = isDebug
      ? import.meta.env.VITE_CLOUD_LIFETIME_DEV
      : import.meta.env.VITE_CLOUD_LIFETIME;

    // Convert to number (minutes)
    return Number(lifetimeValue);
  } catch (error) {
    console.error("Error parsing ephemera lifetime:", error);
    // Default: 14 days in minutes
    return 14 * 24 * 60;
  }
};

/**
 * Convert minutes to days for display purposes
 * @param minutes The number of minutes to convert
 * @returns The number of days as a string with one decimal place
 */
const minutesToDays = (minutes: number): string => {
  return (minutes / (24 * 60)).toFixed(1);
};

export const config = {
  /** Is the app running in development mode */
  devMode: isDebug,

  /** Ephemera lifetime in minutes */
  ephemeraLifetimeMinutes: parseEphemeraLifetime(),

  /** 
   * Ephemera lifetime in days (for display and calculations that expect days)
   * @returns The lifetime as a number
   */
  get ephemeraLifetimeString(): number {
    return isDebug
      ? this.ephemeraLifetimeMinutes
      : Number(minutesToDays(this.ephemeraLifetimeMinutes));
  },

  /**
   * Display string for the ephemera lifetime
   * @returns A formatted string with units
   */
  get ephemeraLifetimeDisplay(): string {
    return isDebug
      ? `${this.ephemeraLifetimeMinutes} minutes`
      : `${this.ephemeraLifetimeString} days`;
  },
};

// Log configuration on init
console.log("Configuration loaded:");
console.log("devmode:", isDebug);
console.log(`App running in ${isDebug ? "development" : "production"} mode`);
console.log(
  `Ephemera lifetime: ${config.ephemeraLifetimeMinutes} minutes (${config.ephemeraLifetimeDisplay})`
);
