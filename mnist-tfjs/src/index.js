// Make model globally available
window.model = null;

async function loadModel() {
    try {
        const status = document.getElementById('status');
        status.textContent = 'Model Status: Loading pre-trained model...';
        
        // Load the model from the relative /model directory
        window.model = await tf.loadLayersModel('model/model.json');
        console.log('Model loaded successfully');
        
        status.textContent = 'Model Status: Ready';
        
        // Enable drawing interface
        document.getElementById('drawingCanvas').style.display = 'block';
        document.getElementById('clearButton').style.display = 'block';
    } catch (error) {
        console.error('Error loading model:', error);
        document.getElementById('status').textContent = 'Model Status: Error loading model';
    }
}

// Start when page is loaded
document.addEventListener('DOMContentLoaded', loadModel);