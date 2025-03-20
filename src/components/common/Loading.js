import React from 'react';
import './Loading.css';

const Loading = ({ text = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <div className="loading-dots">
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
      </div>
      <div className="loading-text">{text}</div>
    </div>
  );
};

export default Loading;