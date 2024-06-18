'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSharedState } from './components/StateStore';
import { renderValue } from './components/lib';
import Pagination from './components/Pagination';

const Index = () => {
  const {
    currentItems,
    setCurrentItems,
    headers,
    setHeaders,
    url,
    setUrlData,
    footer,
    setFooter,
    filteredData,
    setFilteredData,
    currentPage,
    setCurrentPage,
    columnVisibility,
  } = useSharedState();

  const [error, setError] = useState(null);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const response = await axios.get(url);
        const { headers, data } = response.data;
        setHeaders(headers);
        setUrlData(data);
        setFilteredData(data);
      } catch (error) {
        setError(error);
      }
    };

    if (url) {
      fetchDataFromApi();
    }
  }, [url, setHeaders, setUrlData, setFilteredData, setError]);

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Get current items based on pagination
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(filteredData.slice(indexOfFirstItem, indexOfLastItem));
  }, [filteredData, currentPage, itemsPerPage, setCurrentItems]);

  console.log(currentItems);

  // Handle page change
  const handlePageChange = (action) => {
    if (action === 'prev') {
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    } else if (action === 'next') {
      setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex">
        <div className="">
          <section className="mx-auto flex flex-wrap justify-center">
            <div>
              <table id="income_table">
                <thead id='header'>
                  <tr>
                    {headers.map((header, index) => (
                      columnVisibility[header] && (
                        <th key={index}>{header}</th>
                      )
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr key={index}>
                      {item.map((cell, colIndex) => (
                        columnVisibility[headers[colIndex]] && (
                          <td key={colIndex}>{renderValue(cell)}</td>
                        )
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <Pagination
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
          />
          <div>
            <input
              id="footer"
              type="text"
              value={footer}
              onChange={(e) => setFooter(e.target.value)}
              placeholder="Enter Footer Text"
              className="px-10 py-4 rounded focus:outline-none mt-3 address-input"
              style={{
                width: '70%',
                height: '3%',
                resize: 'both',
                overflow: 'auto',
                border: footer ? 'none' : '1px solid gray',
              }}
            />
          </div>
        </div>
      </div>
      {error && <p>Error: {error.message}</p>}
      <style>
        {`
          table,
          th,
          td {
            border: 1px solid black;
            border-collapse: collapse;
          }
        `}
      </style>
    </div>
  );
};

export default Index;



