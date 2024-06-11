'use client'

import React from 'react';
import RichTextEditor from './RichTextEditor';
import DownloadBtns from './DownloadBtns';
import Checkboxes from './Checkboxes';
import {useSharedState} from './StateStore';

const SearchBar = () => {
  const { search, setSearch, urlData, setData, url, setUrl, selectedColumns, setFilteredData, setSelectedColumns, setCurrentPage } = useSharedState();

  const handleSearch = (term) => {
    setSearch(term);
    let filtered = urlData;

    if (term) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(term.toLowerCase())
        )
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset pagination to first page after search
  };

  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);
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
