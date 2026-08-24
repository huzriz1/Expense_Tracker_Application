// CommonJS wrapper for Vercel (@vercel/node) to invoke the Express app exported from server.mjs
// This exports a serverless-compatible handler. The first invocation dynamically imports
// the ESM server (server.mjs), caches the Express app, and forwards requests to it.

let cachedApp = null;

module.exports = async (req, res) => {
  try {
    if (!cachedApp) {
      const mod = await import('./server.mjs');
      // server.mjs exports the Express app as default
      cachedApp = mod.default || mod.app || mod;
      if (!cachedApp) {
        throw new Error('Failed to load Express app from server.mjs');
      }
    }

    // Express app is a function (req, res) so call it directly
    return cachedApp(req, res);
  } catch (err) {
    console.error('Error in serverless wrapper:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
};
