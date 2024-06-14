"use client"

import React, { useState, useEffect } from 'react';
import { useBetween } from 'use-between';

const useStateStore = () => {
  const [search, setSearch] = useState('');
  const [url, setUrl] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [urlData, setUrlData] = useState([]);
  const [footer, setFooter] = useState('');
  const [logo, setLogo] = useState(null);
  const [address, setAddress] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [headers, setHeaders] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({}); 
  const [accountNumber, setAccountNumber] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (headers.length > 0) {
      const initialVisibility = {};
      headers.forEach(header => {
        initialVisibility[header] = true;
      });
      setColumnVisibility(initialVisibility);
    }
  }, [headers]);

  return {
    search,
    setSearch,
    url,
    setUrl,
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
    setCurrentPage,
    headers, 
    setHeaders,currentItems, 
    setCurrentItems,
    endDate, 
    setEndDate,
    startDate,
    setStartDate,
    accountNumber, 
    setAccountNumber,
    columnVisibility, 
    setColumnVisibility
  };
};

export function useSharedState() {
  return useBetween(useStateStore);
}
