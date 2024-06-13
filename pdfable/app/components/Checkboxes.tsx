'use client'

import React, { useEffect, useState } from 'react';

const Checkboxes = ({ headers = [], selectedColumns = [], setFilteredData }) => {
  // Handle checkbox change for individual headers
  const handleHeaderChange = (index) => {
    setFilteredData(prevSelectedColumns =>
      prevSelectedColumns.includes(index)
        ? prevSelectedColumns.filter(col => col !== index)
        : [...prevSelectedColumns, index]
    );
  };

  // Determine if "Select All" checkbox should be checked
  const allChecked = headers.length === selectedColumns.length;

  // Handle click on "Select All" checkbox
  const toggleAllCheckboxes = () => {
    if (allChecked) {
      setFilteredData([]);
    } else {
      setFilteredData([...Array(headers.length).keys()]);
    }
  };

  return (
    <div>
      <p>Headers Showing:</p>
      <div>
        <div>
          <input
            type="checkbox"
            id={`checkbox-all`}
            checked={allChecked}
            onChange={toggleAllCheckboxes}
          />
          <label htmlFor={`checkbox-all`}>Select All</label>
        </div>
        {headers.map((header, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`checkbox-${header}`}
              checked={selectedColumns.includes(index)}
              onChange={() => handleHeaderChange(index)}
            />
            <label htmlFor={`checkbox-${header}`}>{header}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Checkboxes;


