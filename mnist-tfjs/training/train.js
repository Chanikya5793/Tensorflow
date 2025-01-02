const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

async function loadMNISTData() {
    try {
        const dataDir = path.join(__dirname, '../public/data/mnist');
        
        // Read IDX files
        const trainImages = fs.readFileSync(path.join(dataDir, 'train-images.idx3-ubyte'));
        const trainLabels = fs.readFileSync(path.join(dataDir, 'train-labels.idx1-ubyte'));
        const testImages = fs.readFileSync(path.join(dataDir, 't10k-images.idx3-ubyte'));
        const testLabels = fs.readFileSync(path.join(dataDir, 't10k-labels.idx1-ubyte'));

        function parseIDX(buffer) {
            const headerLength = 4; // Magic number size
            const dims = [];
            const view = new DataView(buffer.buffer);
            
            // Read magic number
            const magic = view.getInt32(0, false);
            const dimCount = magic & 0xFF; // Last byte is dimension count
            
            // Read dimension sizes
            for (let i = 0; i < dimCount; i++) {
                dims.push(view.getInt32(headerLength + i * 4, false));
            }
            
            const dataOffset = headerLength + dimCount * 4;
            const data = new Uint8Array(buffer.slice(dataOffset));
            
            return {
                dims,
                data: Array.from(data)
            };
        }

        // Parse the data files
        const trainImageData = parseIDX(trainImages);
        const trainLabelData = parseIDX(trainLabels);
        const testImageData = parseIDX(testImages);
        const testLabelData = parseIDX(testLabels);

        console.log('Training images shape:', trainImageData.dims);
        console.log('Training labels shape:', trainLabelData.dims);

        // Create tensors with correct shapes
        const trainXs = tf.tensor4d(
            trainImageData.data,
            [trainImageData.dims[0], trainImageData.dims[1], trainImageData.dims[2], 1]
        ).div(255.0); // Normalize pixel values

        const trainYs = tf.oneHot(
            tf.tensor1d(trainLabelData.data, 'int32'),
            10
        );

        const testXs = tf.tensor4d(
            testImageData.data,
            [testImageData.dims[0], testImageData.dims[1], testImageData.dims[2], 1]
        ).div(255.0);

        const testYs = tf.oneHot(
            tf.tensor1d(testLabelData.data, 'int32'),
            10
        );

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

// Rest of the code remains the same...
async function createModel() {
    const model = tf.sequential();
    
    model.add(tf.layers.conv2d({
        inputShape: [28, 28, 1],
        kernelSize: 3,
        filters: 32,
        activation: 'relu'
    }));
    
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));
    model.add(tf.layers.conv2d({
        kernelSize: 3,
        filters: 64,
        activation: 'relu'
    }));
    
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({units: 128, activation: 'relu'}));
    model.add(tf.layers.dropout({rate: 0.2}));
    model.add(tf.layers.dense({units: 10, activation: 'softmax'}));

    model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    return model;
}

async function trainAndSaveModel() {
    try {
        console.log('Loading MNIST data...');
        const data = await loadMNISTData();
        
        console.log('Creating model...');
        const model = await createModel();
        
        console.log('Training model...');
        await model.fit(data.trainXs, data.trainYs, {
            batchSize: 32,
            validationData: [data.testXs, data.testYs],
            epochs: 10,
            shuffle: true,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    console.log(`Epoch ${epoch + 1}/${10}`);
                    console.log(`Loss: ${logs.loss.toFixed(4)}`);
                    console.log(`Accuracy: ${logs.acc.toFixed(4)}`);
                }
            }
        });

        // Save model
        const modelPath = 'file://' + path.join(__dirname, '../public/model');
        await model.save(modelPath);
        console.log('Model saved successfully to', modelPath);
    } catch (error) {
        console.error('Training error:', error);
    }
}

trainAndSaveModel();