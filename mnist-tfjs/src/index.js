async function getData() {
    try {
        // Load local MNIST data
        const trainImages = await tf.browser.fromPixels('/data/mnist_images.png', 1);
        const trainLabels = await fetch('/data/mnist_labels_uint8')
            .then(response => response.arrayBuffer())
            .then(buffer => new Uint8Array(buffer));

        // Prepare training data
        const TRAIN_DATA_SIZE = 5500;
        const TEST_DATA_SIZE = 1000;

        const trainXs = trainImages.slice([0, 0, 0], [TRAIN_DATA_SIZE, 28, 28]);
        const trainYs = tf.oneHot(tf.tensor1d(trainLabels.slice(0, TRAIN_DATA_SIZE), 'int32'), 10);
        const testXs = trainImages.slice([TRAIN_DATA_SIZE, 0, 0], [TEST_DATA_SIZE, 28, 28]);
        const testYs = tf.oneHot(tf.tensor1d(trainLabels.slice(TRAIN_DATA_SIZE, TRAIN_DATA_SIZE + TEST_DATA_SIZE), 'int32'), 10);

        return {
            trainXs,
            trainYs,
            testXs,
            testYs
        };
    } catch (error) {
        console.error('Error loading MNIST data:', error);
        throw error;
    }
}







/*


// Make model globally available
window.model = null;

async function getData() {
    try {
        // Load MNIST data from hosted files
        const trainData = await fetch('https://storage.googleapis.com/tfjs-tutorials/mnist_data.json')
            .then(response => response.json());
        
        // Prepare training data
        const trainImages = tf.tensor4d(
            trainData.trainImages,
            [trainData.trainImages.length / 784, 28, 28, 1]
        );
        const trainLabels = tf.oneHot(tf.tensor1d(trainData.trainLabels, 'int32'), 10);
        
        // Split into train and test sets
        const TRAIN_DATA_SIZE = 5500;
        const TEST_DATA_SIZE = 1000;
        
        const trainXs = trainImages.slice([0, 0, 0, 0], [TRAIN_DATA_SIZE]);
        const trainYs = trainLabels.slice([0, 0], [TRAIN_DATA_SIZE]);
        const testXs = trainImages.slice([TRAIN_DATA_SIZE, 0, 0, 0], [TEST_DATA_SIZE]);
        const testYs = trainLabels.slice([TRAIN_DATA_SIZE, 0], [TEST_DATA_SIZE]);

        return {
            trainXs,
            trainYs,
            testXs,
            testYs
        };
    } catch (error) {
        console.error('Error loading MNIST data:', error);
        throw error;
    }
}

async function createModel() {
    const model = tf.sequential();
    
    model.add(tf.layers.conv2d({
        inputShape: [28, 28, 1],
        kernelSize: 5,
        filters: 8,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));
    
    model.add(tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2]
    }));
    
    model.add(tf.layers.conv2d({
        kernelSize: 5,
        filters: 16,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));
    
    model.add(tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2]
    }));
    
    model.add(tf.layers.flatten());
    
    model.add(tf.layers.dense({
        units: 10,
        activation: 'softmax',
        kernelInitializer: 'varianceScaling'
    }));

    model.compile({
        optimizer: tf.train.adam(),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });
    // Add logging
    console.log('Model created successfully');
    return model;
}

// Update train function to use new data format
async function train(model, data) {
    const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
    const container = {
        name: 'Model Training', 
        styles: { height: '500px' }
    };
    
    const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);
    
    try {
        return await model.fit(data.trainXs, data.trainYs, {
            batchSize: 512,
            validationData: [data.testXs, data.testYs],
            epochs: 10,
            shuffle: true,
            callbacks: fitCallbacks
        });
    } catch (error) {
        console.error('Error during training:', error);
        throw error;
    }
}
let model;

async function main() {
    try {
        // Show tfvis viewer
        tfvis.visor().open();
        
        const status = document.getElementById('status');
        status.textContent = 'Model Status: Loading data...';
        
        console.log('Loading MNIST data...');
        const data = await getData();
        
        console.log('Creating model...');
        window.model = await createModel();
        
        // Show model summary
        await tfvis.show.modelSummary(
            {name: 'Model Architecture', tab: 'Model'}, 
            window.model
        );

        status.textContent = 'Model Status: Training...';
        status.className = 'training';

        await train(window.model, data);
        
        status.textContent = 'Model Status: Ready';
        status.className = 'ready';
        
        document.getElementById('drawingCanvas').style.display = 'block';
        document.getElementById('clearButton').style.display = 'block';
    } catch (error) {
        console.error('Main error:', error);
        const status = document.getElementById('status');
        status.textContent = 'Model Status: Error occurred';
        status.className = 'error';
    }
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', main);






*/



