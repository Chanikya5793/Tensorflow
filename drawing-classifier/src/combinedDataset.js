// src/combinedDataset.js

import { loadMnistDataset } from "./mnist";
import { loadShapesDataset } from "./shapes";

export async function loadCombinedDataset() {
  try {
    // Load MNIST digits
    const { trainXs: mnistTrainXs, trainYs: mnistTrainYs, testXs: mnistTestXs, testYs: mnistTestYs } = await loadMnistDataset();

    // Load shapes data
    const { images: shapesImages, labels: shapesLabels } = await loadShapesDataset();

    // Combine training data
    const combinedTrainXs = mnistTrainXs.concat(shapesImages);
    const combinedTrainYs = mnistTrainYs.concat(shapesLabels);

    // Similarly, combine test data if applicable
    // Assuming shapes dataset has separate test data
    // If not, adjust accordingly

    return { trainXs: combinedTrainXs, trainYs: combinedTrainYs };
  } catch (error) {
    console.error('Error loading combined dataset:', error);
    throw error;
  }
}