"use client"

import React, { useState } from 'react';
import { useBetween } from 'use-between';

const useStateStore = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [url, setUrl] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

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
  };
};

export function useSharedState() {
  return useBetween(useStateStore);
}
