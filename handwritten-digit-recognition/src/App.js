// src/App.js
import React, { useState, useEffect } from 'react';
import Canvas from './Canvas';
import * as tf from '@tensorflow/tfjs';
import createModel from './model';

const App = () => {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      const newModel = createModel();
      // TODO: Load pre-trained weights or train the model here
      setModel(newModel);
    };
    loadModel();
  }, []);

  const handleDraw = () => {
    if (model) {
      const canvas = document.querySelector('canvas');
      const imgData = canvas.getContext('2d').getImageData(0, 0, 280, 280);
      const tensor = tf.browser.fromPixels(imgData, 1)
        .resizeNearestNeighbor([28, 28])
        .toFloat()
        .div(tf.scalar(255))
        .reshape([1, 28, 28, 1]);

      const preds = model.predict(tensor);
      preds.array().then(array => {
        const probs = array[0];
        const maxProb = Math.max(...probs);
        const predictedDigit = probs.indexOf(maxProb);
        setPrediction({ digit: predictedDigit, confidence: (maxProb * 100).toFixed(2) });
      });
    }
  };

  return (
    <div>
      <h1>Handwritten Digit Recognition</h1>
      <Canvas onDraw={handleDraw} />
      {prediction && (
        <div>
          <h2>Prediction: {prediction.digit}</h2>
          <p>Confidence: {prediction.confidence}%</p>
        </div>
      )}
    </div>
  );
};

export default App;