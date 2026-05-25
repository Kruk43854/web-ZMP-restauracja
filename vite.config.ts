import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [ tailwindcss(), reactRouter(), tsconfigPaths(), react(),
    {
      name: 'chrome-devtools-fix',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/.well-known/appspecific/com.chrome.devtools.json') {
            res.setHeader('Content-Type', 'application/json');
            res.end('{}');
            return;
          }
          next();
        });
      }
    }
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './app/setupTests.ts',
  }
});