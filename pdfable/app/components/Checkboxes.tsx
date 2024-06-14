'use client';

// Checkboxes.js
import React from 'react';
import { useSharedState } from './StateStore';

const Checkboxes = () => {
  const { headers, columnVisibility, setColumnVisibility } = useSharedState();

  // Handle checkbox change for individual headers
  const handleHeaderChange = (header) => {
    setColumnVisibility(prevVisibility => ({
      ...prevVisibility,
      [header]: !prevVisibility[header]
    }));
  };

  return (
    <div>
      <p>Headers Showing:</p>
      <div>
        {headers.map((header) => (
          <div key={header}>
            <input
              type="checkbox"
              id={`checkbox-${header}`}
              checked={columnVisibility[header]}
              onChange={() => handleHeaderChange(header)}
            />
            <label htmlFor={`checkbox-${header}`}>{header}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Checkboxes;
