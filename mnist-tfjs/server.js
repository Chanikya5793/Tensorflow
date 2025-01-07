const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Enable CORS for all origins (since served via Nginx, this might be optional)
app.use(cors());

// Serve static files from the 'public' directory
app.use('/model', express.static(path.join(__dirname, 'public/model'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*'); // Adjust as needed
  }
}));

app.use('/src', express.static(path.join(__dirname, 'src'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*'); // Adjust as needed
  }
}));

// Other routes or APIs if any

const PORT = 3500;  // Changed from 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});