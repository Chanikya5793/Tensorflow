// In App.js or a separate testing script
useEffect(() => {
  async function testDataLoading() {
    const mnistData = await loadMnistDataset();
    const shapesData = await loadShapesDataset();
    console.log('MNIST Images:', mnistData.images.shape);
    console.log('MNIST Labels:', mnistData.labels.shape);
    console.log('Shapes Images:', shapesData.images.shape);
    console.log('Shapes Labels:', shapesData.labels.shape);
  }

  testDataLoading();
}, []);