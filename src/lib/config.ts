// Configuration values from environment variables
const devMode = import.meta.env.VITE_DEV_MODE === "true";

// Parse the ephemera lifetime value
const parseEphemeraLifetime = () => {
  try {
    // Choose the appropriate environment variable based on dev mode
    const lifetimeValue = devMode
      ? import.meta.env.VITE_CLOUD_LIFETIME_DEV
      : import.meta.env.VITE_CLOUD_LIFETIME;

    // Convert to number (minutes)
    return Number(lifetimeValue);
  } catch (error) {
    console.error("Error parsing ephemera lifetime:", error);
    // Default: 30 days in minutes (43200 minutes)
    return 43200;
  }
};

// Convert minutes to days for display purposes
const minutesToDays = (minutes: number) => {
  return (minutes / (24 * 60)).toFixed(1);
};

export const config = {
  // Is the app running in development mode
  devMode,

  // Ephemera lifetime in minutes
  ephemeraLifetimeMinutes: parseEphemeraLifetime(),

  // Ephemera lifetime in days (for display and calculations that expect days)
  get ephemeraLifetimeDays() {
    return Number(minutesToDays(this.ephemeraLifetimeMinutes));
  },

  // Display string for the ephemera lifetime
  get ephemeraLifetimeDisplay() {
    const days = this.ephemeraLifetimeDays;
    if (days < 1) {
      return `${(days * 24).toFixed(1)} hours`;
    }
    return `${days} days`;
  },
};

console.log(`App running in ${devMode ? "development" : "production"} mode`);
console.log(
  `Ephemera lifetime: ${config.ephemeraLifetimeMinutes} minutes (${config.ephemeraLifetimeDisplay})`
);
