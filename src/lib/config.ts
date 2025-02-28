// Configuration values from environment variables
const isDebug = import.meta.env.VITE_DEBUG === "true";

// Parse the ephemera lifetime value
const parseEphemeraLifetime = () => {
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

// Convert minutes to days for display purposes
const minutesToDays = (minutes: number) => {
  return (minutes / (24 * 60)).toFixed(1);
};

export const config = {
  // Is the app running in development mode
  devMode: isDebug,

  // Ephemera lifetime in minutes
  ephemeraLifetimeMinutes: parseEphemeraLifetime(),

  // Ephemera lifetime in days (for display and calculations that expect days)
  get ephemeraLifetimeString() {
    const timeString = isDebug
      ? this.ephemeraLifetimeMinutes
      : Number(minutesToDays(this.ephemeraLifetimeMinutes));
    return timeString;
  },

  // Display string for the ephemera lifetime
  get ephemeraLifetimeDisplay() {
    return isDebug
      ? `${this.ephemeraLifetimeMinutes} minutes`
      : `${this.ephemeraLifetimeString} days`;
  },
};

console.log("Configuration loaded:");
console.log("devmode:", isDebug);
console.log(`App running in ${isDebug ? "development" : "production"} mode`);
console.log(
  `Ephemera lifetime: ${config.ephemeraLifetimeMinutes} 
  ${isDebug ? "minutes" : "days"} 
  ${config.ephemeraLifetimeDisplay})`
);
