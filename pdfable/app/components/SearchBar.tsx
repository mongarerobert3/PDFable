'use client'

import React from 'react';
import RichTextEditor from './RichTextEditor';
import DownloadBtns from './DownloadBtns';
import Checkboxes from './Checkboxes';
import {useSharedState} from './StateStore';

const SearchBar = () => {
  const { search, setSearch, data, setData, url, setUrl, selectedColumns, setFilteredData, setSelectedColumns } = useSharedState();

  const handleSearch = (term) => {
    setSearch(term);
    let filtered = data;

    if (term) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(term.toLowerCase())
        )
      );
    }

    if (selectedColumns.length > 0) {
      filtered = filtered.map(row => {
        const filteredRow = {};
        selectedColumns.forEach(column => {
          if (row.hasOwnProperty(column)) {
            filteredRow[column] = row[column];
          }
        });
        return filteredRow;
      });
    }

    setFilteredData(filtered);
  };

  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);
  };

  const handleCustomUrl = () => {
    if (url) {
      setUrl(url);
    } else {
      alert("Please Insert Url");
    }
  };

  return (
    <div>
      <section className="flex flex-col items-center justify-center min-h-screen">
        <RichTextEditor />
        <header className="text-gray-600 body-font">
          <div className="container mx-auto flex flex-col items-center justify-center py-5 space-y-4">
            <input
              type="text"
              className="border border-gray-200 p-2 w-64"
              placeholder="Search..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />

            <DownloadBtns />

            <div className="flex space-x-4">
              <input
                type="text"
                className="border border-gray-200 p-2"
                placeholder="Input custom API..."
                onChange={(e) => handleUrlChange(e.target.value)}
              />
              <button
                className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base"
                onClick={handleCustomUrl}
              >
                Custom Table
              </button>
            </div>
          </div>
          <div className="ml-7">
            <Checkboxes setData={setData} selectedColumns={selectedColumns} setSelectedColumns={setSelectedColumns} url={url} />
          </div>
        </header>
      </section>
    </div>
  );
};

export default SearchBar;
