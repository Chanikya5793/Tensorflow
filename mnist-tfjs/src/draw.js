const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clearButton');
const predictionsDiv = document.getElementById('predictions');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Set initial canvas state
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = 'black';
ctx.lineWidth = 15;
ctx.lineCap = 'round';

// Drawing event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
clearButton.addEventListener('click', clearCanvas);

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    predictionsDiv.innerHTML = '';
}

// Use window.model instead of model
async function getPrediction() {
    if (!window.model) {
        console.log('Model not ready');
        return;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    const tensor = tf.tidy(() => {
        return tf.browser.fromPixels(imageData, 1)
            .resizeBilinear([28, 28])
            .reshape([1, 28, 28, 1])
            .toFloat()
            .div(255.0);
    });

    try {
        const predictions = await window.model.predict(tensor).data();
        const topPredictions = Array.from(predictions)
            .map((prob, digit) => ({ digit, probability: prob }))
            .sort((a, b) => b.probability - a.probability)
            .slice(0, 3);

        predictionsDiv.innerHTML = topPredictions
            .map(pred => `
                <div class="prediction-item">
                    <span>Digit ${pred.digit}</span>
                    <span>${(pred.probability * 100).toFixed(2)}%</span>
                </div>
            `)
            .join('');
    } catch (error) {
        console.error('Prediction error:', error);
    } finally {
        tensor.dispose();
    }
}
function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        getPrediction();
    }
}