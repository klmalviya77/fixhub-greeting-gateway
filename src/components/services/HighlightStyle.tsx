
import React from 'react';

const HighlightStyle: React.FC = () => {
  return (
    <style>{`
      .highlight-service {
        animation: pulse-highlight 2s;
      }
      
      @keyframes pulse-highlight {
        0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
        100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
      }
    `}</style>
  );
};

export default HighlightStyle;
