import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initDatabase } from './server/db';
import { apiRouter, authenticateToken } from './server/routes';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Initialize relational database schema & seed owner
initDatabase();

// Middleware for parsing JSON and urlencoded payloads (support for cover image previews)
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Auth Token Extractor Middleware
app.use(authenticateToken);

// Mount API routes under /api
app.use('/api', apiRouter);

// Development vs Production Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite dev server in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);
    console.log('[Dev] Mounted Vite middlewares on Express server');
  } else {
    // Serve production static assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Prod] Serving static frontend from dist folder');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[The Book Exchange] Full-stack server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[The Book Exchange] Failed to start server:', err);
  process.exit(1);
});
