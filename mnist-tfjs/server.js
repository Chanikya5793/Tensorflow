const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// Enable CORS for localhost:3001
app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// Basic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Also ensure static files under /model have CORS headers
app.use('/model', express.static(path.join(__dirname, 'public/model'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// Serve the rest of /public
app.use(express.static('public', {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

app.use('/src', express.static('src'));

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`TensorFlow.js server running at http://localhost:${PORT}`);
    console.log(`Also accessible at http://192.168.1.4:${PORT}`);
});