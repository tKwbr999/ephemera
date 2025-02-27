// Configuration values from environment variables
const devMode = import.meta.env.VITE_DEV_MODE === 'true';

// Parse the cloud lifetime value
const parseCloudLifetime = () => {
  try {
    // Choose the appropriate environment variable based on dev mode
    const lifetimeValue = devMode 
      ? import.meta.env.VITE_CLOUD_LIFETIME_DEV 
      : import.meta.env.VITE_CLOUD_LIFETIME;
    
    // Convert to number (minutes)
    return Number(lifetimeValue);
  } catch (error) {
    console.error('Error parsing cloud lifetime:', error);
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
  
  // Cloud lifetime in minutes
  cloudLifetimeMinutes: parseCloudLifetime(),
  
  // Cloud lifetime in days (for display and calculations that expect days)
  get cloudLifetimeDays() {
    return Number(minutesToDays(this.cloudLifetimeMinutes));
  },
  
  // Display string for the cloud lifetime
  get cloudLifetimeDisplay() {
    const days = this.cloudLifetimeDays;
    if (days < 1) {
      return `${(days * 24).toFixed(1)} hours`;
    }
    return `${days} days`;
  }
};

console.log(`App running in ${devMode ? 'development' : 'production'} mode`);
console.log(`Cloud lifetime: ${config.cloudLifetimeMinutes} minutes (${config.cloudLifetimeDisplay})`);