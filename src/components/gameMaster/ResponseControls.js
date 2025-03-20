import React from 'react';
import './ResponseControls.css';

const ResponseControls = ({ onRetry, onEdit, isGenerating }) => {
  return (
    <div className="response-controls">
      <button 
        className="control-button retry" 
        onClick={onRetry}
        disabled={isGenerating}
        title="Regenerate the last response"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 4v6h6"></path>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
        </svg>
        <span>Retry</span>
      </button>
      
      <button 
        className="control-button edit" 
        onClick={onEdit}
        disabled={isGenerating}
        title="Edit the last response"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
        </svg>
        <span>Edit</span>
      </button>
      
      <div className="control-info">
        <span className="info-text">These controls affect the Game Master's last response.</span>
      </div>
    </div>
  );
};

export default ResponseControls;