import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import DrawingCanvas from './components/DrawingCanvas';
import './App.css';

function App() {
  const [model, setModel] = useState(null);
  const [status, setStatus] = useState('Loading model...');
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    async function loadModel() {
      try {
        // Use the proxied path
        const modelUrl = '/Tensorflow/model/model.json';
        const loadedModel = await tf.loadLayersModel(modelUrl);
        setModel(loadedModel);
        setStatus('Model loaded successfully');
      } catch (error) {
        console.error('Error loading model:', error);
        setStatus('Error loading model');
      }
    }
    loadModel();
  }, []);

  const handlePredict = async (imageData) => {
    if (!model) return;

    try {
      const tensor = tf.tidy(() => {
        return tf.browser.fromPixels(imageData, 1)
          .resizeBilinear([28, 28])
          .reshape([1, 28, 28, 1])
          .toFloat()
          .div(255.0);
      });

      const predictions = await model.predict(tensor).data();
      const topPredictions = Array.from(predictions)
        .map((prob, digit) => ({ digit, probability: prob }))
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 3);

      setPredictions(topPredictions);
      tensor.dispose();
    } catch (error) {
      console.error('Prediction error:', error);
    }
  };

  return (
    <div className="App">
      <h1>MNIST Drawing Recognition</h1>
      <div className="status">{status}</div>
      <DrawingCanvas onPredict={handlePredict} />
      <div className="predictions">
        {predictions.map((pred, index) => (
          <div key={index} className="prediction-item">
            <span>Digit {pred.digit}</span>
            <span>{(pred.probability * 100).toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;