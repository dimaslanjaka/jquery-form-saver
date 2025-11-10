import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import { promises as fs } from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/jquery-form-saver/demo/react/dist/',
  plugins: [
    mkcert(),
    react(),
    // post-build plugin: copy dist/index.html into route folders
    {
      name: 'copy-index-to-routes',
      apply: 'build',
      async closeBundle() {
        try {
          const outDir = path.resolve(__dirname, 'dist');
          const indexPath = path.join(outDir, 'index.html');
          const routes = ['example', 'hook', 'dynamic'];
          const indexHtml = await fs.readFile(indexPath, 'utf8');
          await Promise.all(routes.map(async (r) => {
            const dir = path.join(outDir, r);
            await fs.mkdir(dir, { recursive: true });
            await fs.writeFile(path.join(dir, 'index.html'), indexHtml, 'utf8');
          }));
          console.log('Copied index.html to routes:', routes.join(', '));
        } catch (err) {
          console.error('Failed to copy index.html to routes', err);
        }
      }
    }
  ],
  server: {
    host: process.env.VITE_HOSTNAME || 'dev.webmanajemen.com',
    port: parseInt(String(process.env.VITE_PORT)) || 3888,
    open: false
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
