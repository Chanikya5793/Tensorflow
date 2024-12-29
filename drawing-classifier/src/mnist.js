// src/mnist.js

import * as tf from '@tensorflow/tfjs';
import pako from 'pako';

// Helper function to fetch and decompress .gz files
async function fetchAndDecompress(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  const compressedData = await response.arrayBuffer();
  const decompressedData = pako.ungzip(new Uint8Array(compressedData));
  return decompressedData;
}

export async function loadMnistDataset() {
  try {
    // URLs for the compressed MNIST dataset files
    const IMAGE_URL = 'https://storage.googleapis.com/tfjs-examples/mnist-data/data/mnist_train_images.gz';
    const LABEL_URL = 'https://storage.googleapis.com/tfjs-examples/mnist-data/data/mnist_train_labels.gz';
    const TEST_IMAGE_URL = 'https://storage.googleapis.com/tfjs-examples/mnist-data/data/mnist_test_images.gz';
    const TEST_LABEL_URL = 'https://storage.googleapis.com/tfjs-examples/mnist-data/data/mnist_test_labels.gz';

    // Fetch and decompress the data
    const [trainImagesBuffer, trainLabelsBuffer, testImagesBuffer, testLabelsBuffer] = await Promise.all([
      fetchAndDecompress(IMAGE_URL),
      fetchAndDecompress(LABEL_URL),
      fetchAndDecompress(TEST_IMAGE_URL),
      fetchAndDecompress(TEST_LABEL_URL)
    ]);

    // Helper function to parse IDX image files
    function parseImages(buffer, numImages, numRows, numCols) {
      const data = new Uint8Array(buffer).slice(16); // Remove header
      return tf.tensor4d(data, [numImages, numRows, numCols, 1]).div(255.0);
    }

    // Helper function to parse IDX label files
    function parseLabels(buffer, numLabels) {
      const data = new Uint8Array(buffer).slice(8); // Remove header
      return tf.oneHot(tf.tensor1d(data, 'int32'), 15); // 15 classes: 10 digits + 5 shapes
    }

    // Parse training and testing data
    const trainXs = parseImages(trainImagesBuffer, 60000, 28, 28);
    const trainYs = parseLabels(trainLabelsBuffer, 60000);

    const testXs = parseImages(testImagesBuffer, 10000, 28, 28);
    const testYs = parseLabels(testLabelsBuffer, 10000);

    return { trainXs, trainYs, testXs, testYs };
  } catch (error) {
    console.error('Error loading MNIST dataset:', error);
    throw error;
  }
}