import { defineConfig } from "vite";
import vinext from "vinext";

export default defineConfig({
  plugins: [vinext()],
  define: { "process.env.NEXT_PUBLIC_BASE_PATH": JSON.stringify(process.env.NEXT_PUBLIC_BASE_PATH ?? "") },
});
