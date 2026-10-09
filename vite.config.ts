import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/@supabase/"))
            return "account-services";
          if (id.includes("/node_modules/groq-sdk/")) return "coach-service";
        },
      },
    },
  },
});
