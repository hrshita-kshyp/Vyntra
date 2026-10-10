import { loadEnv } from 'vite';
import { createFitHandler } from './googleFit.js';
import { createJournalHandler } from './journal.js';
export default function fitApiPlugin() {
  return { name: 'local-google-fit-api', configureServer(server) {
    const env = loadEnv(server.config.mode, server.config.root, '');
    const options = { env: { ...process.env, ...env } };
    for (const [path, handler, limit] of [['/api/google-fit', createFitHandler(options), 8192], ['/api/journal', createJournalHandler(options), 270000]]) server.middlewares.use(path, async (req, res) => {
      const chunks = []; let bytes = 0;
      for await (const chunk of req) { bytes += chunk.length; if (bytes > limit) { res.statusCode = 413; res.end(); return; } chunks.push(chunk); }
      req.body = Buffer.concat(chunks).toString('utf8');
      res.status = code => { res.statusCode = code; return res; };
      res.json = body => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(body)); };
      await handler(req, res);
    });
  } };
}
