const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const BUILD_PATH = path.join(__dirname, 'build');

// Serve static files with proper MIME types
app.use(express.static(BUILD_PATH, {
  setHeaders: (res, filepath) => {
    // Set correct MIME types
    if (filepath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filepath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filepath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json');
    }
  }
}));

// SPA fallback: all routes return index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(BUILD_PATH, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  console.log(`✅ Serving SPA from: ${BUILD_PATH}`);
});

