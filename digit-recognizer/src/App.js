import React, { useState, useEffect } from 'react';
import Canvas from './Canvas';
import * as tf from '@tensorflow/tfjs';
import { loadMnistData } from './data';
import '@tensorflow/tfjs-backend-webgl'; // Enable WebGL backend for better performance

const App = () => {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      // Load and prepare the data
      const data = await loadMnistData();

      // Define the model
      const cnnModel = tf.sequential();

      cnnModel.add(tf.layers.conv2d({
        inputShape: [28, 28, 1],
        filters: 32,
        kernelSize: 3,
        activation: 'relu'
      }));
      cnnModel.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
      cnnModel.add(tf.layers.conv2d({
        filters: 64,
        kernelSize: 3,
        activation: 'relu'
      }));
      cnnModel.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
      cnnModel.add(tf.layers.flatten());
      cnnModel.add(tf.layers.dense({ units: 128, activation: 'relu' }));
      cnnModel.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

      cnnModel.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });

      setModel(cnnModel);

      // Train the model
      setTraining(true);
      await cnnModel.fit(data.trainImages, data.trainLabels, {
        epochs: 5,
        validationData: [data.testImages, data.testLabels],
        callbacks: tf.callbacks.earlyStopping({ monitor: 'val_loss', patience: 2 }),
      });
      setTraining(false);
      setLoading(false);
    };

    initialize();
  }, []);

  const handleClear = () => {
    setPrediction(null);
  };

  const handlePredict = async (image) => {
    if (model) {
      // Preprocess the image
      let tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([28, 28])
        .mean(2)
        .toFloat()
        .div(255.0)
        .reshape([1, 28, 28, 1]);

      // Predict
      const preds = model.predict(tensor);
      const predictedClass = preds.argMax(1).dataSync()[0];
      const confidence = preds.max().dataSync()[0] * 100;

      setPrediction({ label: predictedClass, confidence });

      // Clean up
      tensor.dispose();
      preds.dispose();
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Handwritten Digit Recognition</h1>
      {loading ? (
        <p>Loading and training model, please wait...</p>
      ) : training ? (
        <p>Training in progress...</p>
      ) : (
        <>
          <Canvas onClear={handleClear} onPredict={handlePredict} />
          {prediction && (
            <div>
              <h2>Prediction: {prediction.label}</h2>
              <p>Confidence: {prediction.confidence.toFixed(2)}%</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;