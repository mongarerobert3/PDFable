'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DownloadBtns from './DownloadBtns';
import Checkboxes from './Checkboxes';
import { useSharedState } from './StateStore';

const SearchBar = () => {
  const {
    url,
    accountNumber,
    setAccountNumber,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setFilteredData,
    setCurrentPage,
    setSearch,
    setUrl,
    setHeaders,
    headers
  } = useSharedState();
  const [errors, setErrors] = useState({ accountNumber: '', dateRange: '' });

  // Handle search
  const handleSearch = () => {
    let hasErrors = false;
    const newErrors = { accountNumber: '', dateRange: '' };

    if (!accountNumber) {
      newErrors.accountNumber = 'Please enter an account number.';
      hasErrors = true;
    }

    if (!startDate || !endDate) {
      newErrors.dateRange = 'Please select both start and end dates.';
      hasErrors = true;
    }

    setErrors(newErrors);

    if (hasErrors) {
      return false;
    }

    setSearch(accountNumber); // Update search term to accountNumber
    setCurrentPage(1); // Reset pagination
    setFilteredData([]); // Clear previous filtered data

    return true;
  };

  // Handle URL change
  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);
  };

  const handleUrlSearch = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const { headers, data } = await response.json();
  
      console.log("Filtered Data:", { headers, data });
  
      setHeaders(headers);
      setFilteredData(data);
  
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Please try again.');
    }
  };

  const [columnVisibility, setColumnVisibility] = useState(
    headers.reduce((acc, header) => {
      acc[header] = true;
      return acc;
    }, {})
  );

  return (
    <div>
      <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <header className="text-gray-700 body-font">
          <div className="container mx-auto p-5">
            <div className="flex space-x-4 mb-5 mx-4">
              <input
                type="text"
                className="border border-gray-300 p-3 rounded-lg shadow-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Link to JSON data..."
                onChange={(e) => handleUrlChange(e.target.value)}
              />
              <button
                className="inline-flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={handleUrlSearch}
              >
                Search
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
              <div className="flex flex-col items-center space-y-4">
                <h6>Query Statement</h6>
                <input
                  type="text"
                  className="border border-gray-300 p-3 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Account Number..."
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
                {errors.accountNumber && <p className="text-red-500">{errors.accountNumber}</p>}

                <div className="flex justify-between w-full space-x-4">
                  <div className="relative w-1/2">
                    <label className="block mb-2">Start Date</label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      dateFormat="yyyy/MM/dd"
                      className="border border-gray-300 p-3 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="absolute right-3 top-12 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-4 4V3m0 9v9m-4-4h9m-9 0h9M9 12h6"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="relative w-1/2">
                    <label className="block mb-2">End Date</label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      dateFormat="yyyy/MM/dd"
                      className="border border-gray-300 p-3 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="absolute right-3 top-12 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-4 4V3m0 9v9m-4-4h9m-9 0h9M9 12h6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {errors.dateRange && <p className="text-red-500">{errors.dateRange}</p>}

                <DownloadBtns onSearch={handleSearch} />
              </div>
            </div>

            <div className="mt-6">
              <Checkboxes 
                headers={headers}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility} 
              />
            </div>
          </div>
        </header>
      </section>
    </div>

  );
};

export default SearchBar;

