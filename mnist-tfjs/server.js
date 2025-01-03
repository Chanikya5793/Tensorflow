const express = require('express');
const path = require('path');
const app = express();

// Add CORS headers with specific origin
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Serve static files
app.use(express.static('public'));
app.use('/model', express.static(path.join(__dirname, 'public/model')));
app.use('/src', express.static('src'));

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`TensorFlow.js server running at http://localhost:${PORT}`);
    console.log('Open browser console to see training progress');
});