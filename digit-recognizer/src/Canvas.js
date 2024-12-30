// src/Canvas.js
import React, { useRef } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import './Canvas.css'; // Ensure this file exists for styling

const Canvas = ({ onClear, onPredict }) => {
  const canvasRef = useRef(null);

  const handleClear = () => {
    canvasRef.current.resetCanvas();
    onClear();
  };

  const handlePredict = async () => {
    const dataURL = await canvasRef.current.exportImage('png');
    const img = new Image();
    img.src = dataURL;
    img.onload = () => {
      onPredict(img);
    };
  };

  return (
    <div className="canvas-container">
      <ReactSketchCanvas
        ref={canvasRef}
        strokeWidth={8}
        strokeColor="black"
        canvasStyle={{ border: '1px solid #000' }}
        width={300}
        height={300}
      />
      <div className="buttons">
        <button onClick={handleClear}>Clear</button>
        <button onClick={handlePredict}>Predict</button>
      </div>
    </div>
  );
};

export default Canvas;