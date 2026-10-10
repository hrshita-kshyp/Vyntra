import { loadEnv } from 'vite';
import { createFitHandler } from './googleFit.js';
export default function fitApiPlugin() {
  return { name: 'local-google-fit-api', configureServer(server) {
    const env = loadEnv(server.config.mode, server.config.root, '');
    const handler = createFitHandler({ env: { ...process.env, ...env } });
    server.middlewares.use('/api/google-fit', async (req, res) => {
      const chunks = []; let bytes = 0;
      for await (const chunk of req) { bytes += chunk.length; if (bytes > 8192) { res.statusCode = 413; res.end(); return; } chunks.push(chunk); }
      req.body = Buffer.concat(chunks).toString('utf8');
      res.status = code => { res.statusCode = code; return res; };
      res.json = body => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(body)); };
      await handler(req, res);
    });
  } };
}
