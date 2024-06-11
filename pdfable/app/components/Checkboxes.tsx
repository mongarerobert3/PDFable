'use client'

import React, { useEffect, useState } from 'react';
import { fetchData } from '../lib';

const Checkboxes = ({ setData, selectedColumns, setSelectedColumns, url }) => {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const response = url ? await fetch(url).then(res => res.json()) : await fetchData();
        if (response.length > 0) {
          const columnHeaders = Object.keys(response[0]);
          setColumns(columnHeaders);
          setSelectedColumns(columnHeaders); // Select all columns by default
          setData(response); // Set the data in the parent component
        }
      } catch (error) {
        console.log('Error Fetching Data', error);
      }
    };

    fetchDataFromApi();
  }, [url, setData, setSelectedColumns]);

  const handleColumnChange = (column) => {
    setSelectedColumns(prev => 
      prev.includes(column) ? prev.filter(col => col !== column) : [...prev, column]
    );
  };

  return (
    <div>
      <p>Columns to show</p>
      <div>
        {columns.map((column, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`checkbox-${column}`}
              checked={selectedColumns.includes(column)}
              onChange={() => handleColumnChange(column)}
            />
            <label htmlFor={`checkbox-${column}`}>{column}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Checkboxes;
