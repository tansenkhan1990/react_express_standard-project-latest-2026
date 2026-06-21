import React from 'react';

const Loading: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="page-loading">
      <div className="loading-spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
};

export default Loading;
