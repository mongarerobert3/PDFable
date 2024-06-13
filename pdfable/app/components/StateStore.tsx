"use client"

import React, { useState } from 'react';
import { useBetween } from 'use-between';

const useStateStore = () => {
  const [search, setSearch] = useState('');
  const [url, setUrl] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [urlData, setUrlData] = useState([]);
  const [footer, setFooter] = useState('');
  const [logo, setLogo] = useState(null);
  const [address, setAddress] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [headers, setHeaders] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);

  const [accountNumber, setAccountNumber] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return {
    search,
    setSearch,
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
    setCurrentPage,
    headers, 
    setHeaders,currentItems, 
    setCurrentItems,
    endDate, 
    setEndDate,
    startDate,
    setStartDate,
    accountNumber, 
    setAccountNumber
  };
};

export function useSharedState() {
  return useBetween(useStateStore);
}
