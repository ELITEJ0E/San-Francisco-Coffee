import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "next/navigation": path.resolve(__dirname, "./src/lib/next-navigation.ts"),
      "next/link": path.resolve(__dirname, "./src/lib/next-link.tsx"),
      "next/image": path.resolve(__dirname, "./src/lib/next-image.tsx"),
      "next/headers": path.resolve(__dirname, "./src/lib/next-headers.ts"),
    },
  },
  define: {
    'process.env': {},
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    allowedHosts: true,
  },
})
