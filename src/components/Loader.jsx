import React from 'react';
export default function Loader({ text = "Loading..." }) {
  return (
    <div className="state-message">
      <span className="spinner" />
      {text}
    </div>
  );
}
