"use client"

import React, { useState } from 'react';
import { useBetween } from 'use-between';

const useStateStore = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [url, setUrl] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [urlData, setUrlData] = useState([]);
  const [footer, setFooter] = useState('');
  const [logo, setLogo] = useState(null);
  const [address, setAddress] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  return {
    search,
    setSearch,
    data,
    setData,
    url,
    setUrl,
    selectedColumns,
    setSelectedColumns,
    filteredData,
    setFilteredData, 
    urlData, 
    setUrlData,
    footer, 
    setFooter,
    logo, 
    setLogo,
    address, 
    setAddress,currentPage, 
    setCurrentPage
  };
};

export function useSharedState() {
  return useBetween(useStateStore);
}
