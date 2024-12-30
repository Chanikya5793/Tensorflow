import * as tf from '@tensorflow/tfjs';

// Function to load the MNIST dataset
export async function loadMnistData() {
  const mnist = await fetch('https://storage.googleapis.com/tfjs-examples/mnist-data/data.json');
  const data = await mnist.json();

  const imgSize = 784; // 28x28
  const numClasses = 10;

  // Convert the data to tensors
  const trainImages = tf.tensor2d(data.train.images, [data.train.images.length, imgSize]).reshape([data.train.images.length, 28, 28, 1]);
  const trainLabels = tf.tensor1d(data.train.labels, 'int32');
  const testImages = tf.tensor2d(data.test.images, [data.test.images.length, imgSize]).reshape([data.test.images.length, 28, 28, 1]);
  const testLabels = tf.tensor1d(data.test.labels, 'int32');

  // One-hot encode the labels
  const trainLabelsOneHot = tf.oneHot(trainLabels, numClasses);
  const testLabelsOneHot = tf.oneHot(testLabels, numClasses);

  return {
    trainImages,
    trainLabels: trainLabelsOneHot,
    testImages,
    testLabels: testLabelsOneHot
  };
}