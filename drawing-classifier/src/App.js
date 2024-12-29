// src/App.js (Enhanced Architecture)
import React, { useState, useEffect } from "react";
import Canvas from "./Canvas";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import { loadCombinedDataset } from "./combinedDataset";

function App() {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isTraining, setIsTraining] = useState(false);

  const CLASS_NAMES = [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "Square", "Circle", "Triangle", "Tree", "Clock"
  ];

  useEffect(() => {
    async function trainModel() {
      setIsTraining(true);

      // Load combined dataset
      const { trainXs, trainYs, valXs, valYs } = await loadCombinedDataset();

      const NUM_CLASSES = CLASS_NAMES.length;

      // Define the model
      const tempModel = tf.sequential();

      // Convolutional Layer 1
      tempModel.add(tf.layers.conv2d({
        inputShape: [28, 28, 1],
        filters: 32,
        kernelSize: 3,
        activation: "relu",
      }));
      tempModel.add(tf.layers.batchNormalization());
      tempModel.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
      tempModel.add(tf.layers.dropout(0.25));

      // Convolutional Layer 2
      tempModel.add(tf.layers.conv2d({
        filters: 64,
        kernelSize: 3,
        activation: "relu",
      }));
      tempModel.add(tf.layers.batchNormalization());
      tempModel.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
      tempModel.add(tf.layers.dropout(0.25));

      // Flatten
      tempModel.add(tf.layers.flatten());

      // Dense Layer
      tempModel.add(tf.layers.dense({ units: 128, activation: "relu" }));
      tempModel.add(tf.layers.batchNormalization());
      tempModel.add(tf.layers.dropout(0.5));

      // Output Layer
      tempModel.add(tf.layers.dense({ units: NUM_CLASSES, activation: "softmax" }));

      tempModel.compile({
        optimizer: tf.train.adam(),
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"],
      });

      // Training options with callbacks for visualization
      const trainingOptions = {
        epochs: 20,
        batchSize: 128,
        validationData: [valXs, valYs],
        callbacks: tfvis.show.fitCallbacks(
          { name: 'Training Performance' },
          ['loss', 'val_loss', 'acc', 'val_acc'],
          { callbacks: ['onEpochEnd'] }
        )
      };

      // Train the model
      await tempModel.fit(trainXs, trainYs, trainingOptions);

      // Dispose tensors
      trainXs.dispose();
      trainYs.dispose();
      valXs.dispose();
      valYs.dispose();

      setModel(tempModel);
      setIsTraining(false);
    }

    trainModel();
  }, []);

  const handlePredict = async (imageData) => {
    if (!model) return;

    const inputTensor = tf.tidy(() => {
      let tensor = tf.browser.fromPixels(imageData, 1); // Grayscale
      tensor = tf.image.resizeBilinear(tensor, [28, 28]);
      tensor = tensor.div(255.0).expandDims(0).expandDims(-1); // Shape: [1, 28, 28, 1]
      return tensor;
    });

    const preds = model.predict(inputTensor);
    const values = await preds.data();

    const topPreds = Array.from(values)
      .map((prob, index) => ({ label: index, probability: prob }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3);

    const mappedPreds = topPreds.map(pred => ({
      label: CLASS_NAMES[pred.label],
      probability: pred.probability
    }));

    setPredictions(mappedPreds);

    preds.dispose();
    inputTensor.dispose();
  };

  return (
    <div className="App">
      <h1>Drawing Classifier</h1>
      {isTraining ? (
        <div>Training the model, please wait...</div>
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