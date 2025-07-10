// components/SplineRobot.jsx 
 
import React from 'react';
import Spline from '@splinetool/react-spline/next';

const SplineRobot = () => {
  const url = 'https://prod.spline.design/sNPmc2T3k-mpHUAj/scene.splinecode'
  return (
    <div className="absolute inset-0 w-full h-full z-0">
       
      <Spline
        scene={url} 
        width={1290}
        height={793}
      />
    </div>
  );
};

export default SplineRobot;
