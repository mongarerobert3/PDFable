'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchData } from '../lib';

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    const fetchSampleData = async () => {
      try {
        const sampleData = await fetchData();
        setJsonData(sampleData);
        setData(sampleData);
        setFilteredData(sampleData);
      } catch (error) {
        console.log('Fetch Error', error);
      }
    };

    fetchSampleData();
  }, []);

  return (
    <DataContext.Provider value={{ data, setData, filteredData, setFilteredData, jsonData, setJsonData }}>
      {children}
    </DataContext.Provider>
  );
};
