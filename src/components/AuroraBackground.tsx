import React from 'react';

export const AuroraBackground: React.FC = () => {
  return (
    <div className="aurora-root" aria-hidden="true">
      <div className="aurora-blob aurora-blob--a" />
      <div className="aurora-blob aurora-blob--b" />
      <div className="aurora-blob aurora-blob--c" />
      <div className="aurora-sweep" />
    </div>
  );
};
