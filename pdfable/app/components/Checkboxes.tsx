'use client'

import React, { useEffect, useState } from 'react';

const Checkboxes = ({ setData, selectedColumns, setSelectedColumns, url, setUrlData }) => {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const response = await fetch(url).then(res => res.json());
        if (response.length > 0) {
          const columnHeaders = Object.keys(response[0]);
          setColumns(columnHeaders);
          setSelectedColumns(columnHeaders); 
          setData(response);
          setUrlData(response); 
        }
      } catch (error) {
        console.log('Error Fetching Data', error);
      }
    };

    fetchDataFromApi();
  }, [url, setData, setSelectedColumns, setUrlData]);

  const handleColumnChange = (column) => {
    setSelectedColumns(prev =>
      prev.includes(column) ? prev.filter(col => col !== column) : [...prev, column]
    );
  };

  return (
    <div>
      <p>Columns showing</p>
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
