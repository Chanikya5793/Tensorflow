import React from 'react';
import { styled } from '@mui/material/styles';
import { Paper, LinearProgress, Typography, Box } from '@mui/material';

interface Prediction {
  label: string;
  probability: number;
}

interface PredictionDisplayProps {
  predictions: Prediction[];
}

const PredictionContainer = styled(Paper)({
  padding: '1rem',
  margin: '1rem 0',
  width: '280px',
});

const PredictionItem = styled(Box)({
  marginBottom: '0.5rem',
});

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ predictions }) => {
  return (
    <PredictionContainer elevation={3}>
      <Typography variant="h6" gutterBottom>
        Predictions
      </Typography>
      {predictions.map((pred, index) => (
        <PredictionItem key={index}>
          <Typography variant="body2">
            {pred.label}: {(pred.probability * 100).toFixed(1)}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={pred.probability * 100}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </PredictionItem>
      ))}
    </PredictionContainer>
  );
};

export default PredictionDisplay;