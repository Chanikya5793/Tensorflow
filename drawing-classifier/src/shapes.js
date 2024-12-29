// src/shapes.js

import * as tf from '@tensorflow/tfjs';

// Define SHAPE_CLASSES
const SHAPE_CLASSES = ["Square", "Circle", "Triangle", "Tree", "Clock"];

export async function loadShapesDataset() {
  const NUM_SHAPES = SHAPE_CLASSES.length;
  const samplesPerShape = 1000; // Number of samples per shape
  const totalShapes = samplesPerShape * NUM_SHAPES;

  // Simulate grayscale images as random noise (replace with actual shapes)
  const shapeImages = tf.randomNormal([totalShapes, 28, 28, 1]).div(255.0);

  // Assign labels based on SHAPE_CLASSES
  const labels = [];
  for (let i = 0; i < totalShapes; i++) {
    const classIndex = Math.floor(i / samplesPerShape);
    labels.push(classIndex + 10); // Assuming MNIST labels are 0-9, shapes start at 10
  }
  const shapeLabels = tf.oneHot(tf.tensor1d(labels, 'int32'), 15); // Total classes: 15

  return { images: shapeImages, labels: shapeLabels };
}