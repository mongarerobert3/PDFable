'use client';

import React, { useState, useEffect } from 'react';

import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import { fetchData } from '../lib';

const Index = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [jsonData, setJsonData] = useState(null);
  const [url, setUrl] = useState('');
  const itemsPerPage = 25;

  useEffect(() => {
    const fetchSampleData = async () => {
      try {
        const sampleData = await fetchData(''); // Pass empty string to fetch sample data
        setJsonData(sampleData);
        setData(sampleData);
        setFilteredData(sampleData);
      } catch (error) {
        console.log('Fetch Error', error);
      }
    };

    fetchSampleData();
  }, []);

  const handleInputChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSearch = (term) => {
    setSearch(term);
    if (term) {
      const filtered = data.filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(term.toLowerCase())
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < Math.ceil(data.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const fetchDataFromUrl = async () => {
    try {
      if (url) {
        const fetchedData = await fetchData(url);
        setJsonData(fetchedData);
        setData(fetchedData);
        setFilteredData(fetchedData);
      } else {
        alert('No URL provided');
      }
    } catch (error) {
      console.log('Fetch Error', error);
    }
  };

  const offset = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(offset, offset + itemsPerPage);

  return (
    <>
      <Header title="Alpha Vantage Income Statement" />
      <SearchBar search={search} handleSearch={handleSearch} url={url} handleInputChange={handleInputChange} fetchDataFromUrl={fetchDataFromUrl} />
      <section className='mx-auto flex justify-center'>
        <Table data={currentData} jsonData={jsonData} />
      </section>
      <Pagination currentPage={currentPage} handlePageChange={handlePageChange} totalPages={Math.ceil(filteredData.length / itemsPerPage)} />
      <style>
        {`
          table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
          }
        `}
      </style>
    </>
  );
};

export default Index;
