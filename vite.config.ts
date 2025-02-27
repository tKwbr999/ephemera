import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

console.log("process.env.NODE_ENV:", process.env.NODE_ENV);
console.log("development, process.cwd():", process.cwd());
const env = loadEnv(process.env.NODE_ENV || "development", process.cwd());

console.log("VITE_SUPABASE_ANON_KEY:", env.VITE_SUPABASE_ANON_KEY);
console.log("VITE_SUPABASE_URL:", env.VITE_SUPABASE_URL);
console.log("VITE_CLOUD_LIFETIME:", env.VITE_CLOUD_LIFETIME);
console.log("VITE_CLOUD_LIFETIME_DEV:", env.VITE_CLOUD_LIFETIME_DEV);
console.log("VITE_DEBUG:", env.VITE_DEBUG);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
