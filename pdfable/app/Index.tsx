// app/page.js or app/index.js (depending on your file structure)
"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import  {useSharedState} from './components/StateStore';
import { fetchData } from './lib';

const Index = () => {
  const { data, setData, url, filteredData, setFilteredData, selectedColumns } = useSharedState();
  const [currentPage, setCurrentPage] = useState(1);
  const [urlData, setUrlData] = useState([]);

  const itemsPerPage = 25;

  useEffect(() => {
    const fetchedDataAndSet = async () => {
      try {
        const fetchedData = await fetchData();
        setData(fetchedData);
        setFilteredData(fetchedData);
      } catch (error) {
        console.log('Fetch Error', error);
      }
    };

    fetchedDataAndSet();
  }, [setData, setFilteredData]);

  useEffect(() => {
    const fetchedUrlData = async () => {
      const urlSearch = await axios.get(url);
      const urlResponse = urlSearch.data;
      setUrlData(urlResponse);
    };

    if (url) {
      fetchedUrlData();
    }
  }, [url]);

  useEffect(() => {
    setFilteredData(data);
  }, [data, setFilteredData]);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < Math.ceil(data.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const offset = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(offset, offset + itemsPerPage);

  const renderValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value); // Convert object to string for display
    }
    return value !== undefined ? value : "-";
  };

  return (
    <div className="container mx-auto">
      <div className="flex">
        <div className="w-3/4">
          <section className="mx-auto flex flex-wrap justify-center">
            <div>
              <table id="income_table">
                {urlData.length > 0 ? (
                  <>
                    <thead>
                      <tr>
                        {Object.keys(urlData[0]).map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {urlData.map((item, index) => (
                        <tr key={index}>
                          {Object.values(item).map((value, index) => (
                            <td key={index}>{renderValue(value)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </>
                ) : (
                  <>
                    <thead>
                      <tr>
                        {selectedColumns.map((column, index) => (
                          <th key={index}>{column}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {selectedColumns.map((column, colIndex) => (
                            <td key={colIndex}>{row[column]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}
              </table>
            </div>
          </section>
        </div>
      </div>
      <style>
        {`
          table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
          }
        `}
      </style>
    </div>
  );
};

export default Index;
