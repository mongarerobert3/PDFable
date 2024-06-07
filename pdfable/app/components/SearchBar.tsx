'use client';

import React from 'react';

const SearchBar = ({ search, handleSearch, url, handleInputChange, fetchDataFromUrl }) => (
  <header className="text-gray-600 body-font">
    <div className="container mx-auto flex flex-wrap items-center justify-between py-5">
      <input
        type="text"
        className="border border-gray-200 p-2 mx-5"
        placeholder="Search..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <input
        type="text"
        className="border border-gray-200 p-2 mx-5"
        placeholder="Enter URL to JSON data"
        value={url}
        onChange={handleInputChange}
      />
      <button
        className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base"
        onClick={fetchDataFromUrl}
      >
        Fetch Data
      </button>
      <div className="lg:w-2/5 flex justify-end space-x-4">
        <button
          className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base"
          onClick={() => window.dispatchEvent(new Event('downloadPDF'))}
        >
          Download PDF
        </button>
        <button
          className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base"
          onClick={() => window.dispatchEvent(new Event('downloadExcel'))}
        >
          Download Excel
        </button>
      </div>
    </div>
  </header>
);

export default SearchBar;
