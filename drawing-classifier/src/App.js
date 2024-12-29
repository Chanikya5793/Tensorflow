// src/App.js

import React, { useState, useEffect } from "react";
import Canvas from "./Canvas";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import { loadCombinedDataset } from "./combinedDataset";

// Define CLASS_NAMES outside the component
const CLASS_NAMES = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "Square", "Circle", "Triangle", "Tree", "Clock"
];

function App() {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    async function trainModel() {
      setIsTraining(true);

      // Load combined dataset
      const { trainXs, trainYs } = await loadCombinedDataset();

      // Define the number of classes
      const NUM_CLASSES = CLASS_NAMES.length;

      // Create a CNN model
      const tempModel = tf.sequential();

      // First convolutional layer
      tempModel.add(tf.layers.conv2d({
        inputShape: [28, 28, 1],
        filters: 32,
        kernelSize: 3,
        activation: "relu",
      }));
      tempModel.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));

      // Second convolutional layer
      tempModel.add(tf.layers.conv2d({
        filters: 64,
        kernelSize: 3,
        activation: "relu",
      }));
      tempModel.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));

      tempModel.add(tf.layers.flatten());

      // Dense layer
      tempModel.add(tf.layers.dense({ units: 128, activation: "relu" }));

      // Output layer
      tempModel.add(tf.layers.dense({ units: NUM_CLASSES, activation: "softmax" }));

      tempModel.compile({
        optimizer: "adam",
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"],
      });

      // Define training options
      const trainingOptions = {
        epochs: 20,
        batchSize: 128,
        validationSplit: 0.1, // Use 10% of training data for validation
        callbacks: tfvis.show.fitCallbacks(
          { name: 'Training Performance' },
          ['loss', 'val_loss', 'acc', 'val_acc'],
          { callbacks: ['onEpochEnd'] }
        )
      };

      // Train the model
      await tempModel.fit(trainXs, trainYs, trainingOptions);

      // Dispose tensors to free memory
      trainXs.dispose();
      trainYs.dispose();

      setModel(tempModel);
      setIsTraining(false);
      setIsLoading(false);
    }

    trainModel();
  }, [CLASS_NAMES.length]); // Added CLASS_NAMES.length as a dependency

  // ... rest of the component (e.g., rendering Canvas and predictions)
  // Ensure you have the remaining JSX and handlers here

  return (
    <div className="App">
      <h1>Drawing Classifier</h1>
      {isTraining && <div>Training the model...</div>}
      {isLoading ? (
        <div>Loading model, please wait...</div>
      ) : (
        <>
          <Canvas onPredict={handlePredict} />
          <h2>Predictions:</h2>
          <ul>
            {predictions.map((p, idx) => (
              <li key={idx}>
                {p.label}: {(p.probability * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;