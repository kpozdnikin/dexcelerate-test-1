import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      plugins: [
        [
          '@import-meta-env/swc',
          {
            env: '.env.local',
            example: '.env.example',
          },
        ],
      ],
    }),
    tsconfigPaths(),
  ],
  envPrefix: 'VITE_STATIC_',
  server: {
    port: 3000,
    proxy: {
      '/api-rs': {
        target: 'https://api-rs.dexcelerate.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-rs/, ''),
        secure: false
      }
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
