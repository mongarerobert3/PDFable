'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import { fetchData } from './lib';
import Header from './components/Header';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

import * as XLSX from 'xlsx';
import RichTextEditor from './components/RichTextEditor';

const Index = () => {
	const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(data);
  const [url, setUrl] = useState("")

  //carries the data from the url
  const [urlData, setUrlData] = useState([]);




  const itemsPerPage = 25;

  useEffect(() => {
    const fetchedDataAndSet = async () => {
      try {
        const fetchedData = await fetchData();
        setData(fetchedData);
        setFilteredData(fetchedData);
      } catch (error) {
        console.log('Fetch Error', error);
      }
    };

    fetchedDataAndSet()
    }, []);

    useEffect(() => {
      const fetchedUrlData = async () => {
        const urlSearch = await axios.get(url)
        const urlResponse = urlSearch.data
        setUrlData(urlResponse)
      }

      if (url) {
        fetchedUrlData();
      }
    }, [url])


	const handleSearch = (term) => {
    setSearch(term);
    if (term) {
      const filtered = data.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(term.toLowerCase())
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

  const offset = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(offset, offset + itemsPerPage);



  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);

  };

  const handleCustomUrl = () => {
    if (url) {
      setUrl(url)
    } else {
      alert("Please Insert Url")
    }
  }

  const renderValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value); // Convert object to string for display
    }
    return value !== undefined ? value : "-";
  };

  // Library to download pdf file
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const table = document.getElementById('income_table');
    const header = document.getElementById('header');

    if(header) {
      const headerText = header.textContent?.trim()

      doc.setFontSize(20);
      doc.text(headerText, 20, 10);

      const startY = 30;

    //Extract table header
    const headers = [];
    Array.from(table?.querySelectorAll('thead th')).forEach(headerCell => {
      headers.push(headerCell.textContent?.trim());
    })

    //Extarct table data
    const tableData = [];
    Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
        const rowData = [];
        Array.from(row.cells).forEach(cell => {
            rowData.push(cell.textContent.trim());
        });
        tableData.push(rowData);
    });

    //Auto table plugin
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: startY,
    }),

    //Download pdf
    doc.save(`${headerText}.pdf`)
    } else {
      console.error('Header not found');
    }

  };

  // Library to download xlsx file
  const handleDownloadExcel = () => {
    const table = document.getElementById('income_table');
    const headerElement = document.getElementById('header');

    if (table && headerElement) {
      const headerText = headerElement.textContent.trim();

      const headers = [];
      Array.from(table.querySelectorAll('thead th')).forEach(headerCell => {
        headers.push(headerCell.textContent.trim());
      });
      const tableData = [];
      Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
        const rowData = [];
        Array.from(row.cells).forEach(cell => {
          rowData.push(cell.textContent.trim());
        });
        tableData.push(rowData);
      });

      // Create a new workbook and add a worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([headers, ...tableData]);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      // Convert workbook to binary Excel file (xlsx format)
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      // Create a Blob from the buffer
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

      // Create a temporary URL and initiate download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${headerText}.xlsx`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } else {
      console.error('Table or header element not found');
    }
  }

  function handleDownloadAllPages(): void {
    throw new Error('Function not implemented.');
  }

  return (
		<div className='container mx-auto'>
  { /*** Section A */}
  <div className='flex'>
    <div className="w-3/4">
      <Header />
      <section className='mx-auto flex justify-center'>
        <div>
          <table id="income_table">
            {/* Conditional rendering based on whether urlData exists */}
            {urlData.length > 0 ? (
              <>
                {/* Table Header */}
                <thead>
                  <tr>
                    {/* Mapping over keys of the first object in urlData */}
                    {Object.keys(urlData[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody>
                  {/* Mapping over urlData array */}
                  {urlData.map((item, index) => (
                    <tr key={index}>
                      {/* Mapping over values of each object */}
                      {Object.values(item).map((value, index) => (
                        <td key={index}>{renderValue(value)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </>
            ) : (
              <>
                {/* Default Table Header */}
                <thead>
                  <tr>
                    <th>Fiscal Date Ending</th>
                    <th>Gross Profit</th>
                    <th>Total Revenue</th>
                    <th>Operating Income</th>
                    <th>Net Income</th>
                  </tr>
                </thead>
                {/* Default Table Body */}
                <tbody>
                  {filteredData.map((report, index) => (
                    <tr key={index}>
                      <td>{report.fiscalDateEnding}</td>
                      <td>{report.grossProfit}</td>
                      <td>{report.totalRevenue}</td>
                      <td>{report.operatingIncome}</td>
                      <td>{report.netIncome}</td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>
        </div>
      </section>

      {/**** Controls section */}
      <section className="text-gray-600 body-font py-8">
        <div className="container px-5 mx-auto flex items-center md:flex-row flex-col">
          {/* Control buttons */}
          <div className="flex flex-col md:pr-10 md:mb-0 mb-6 pr-0 w-full md:w-auto md:text-left text-center">
            <h6 className="md:text-xs text-gray-900">Alphavantage</h6>
          </div>
          {/* Page navigation buttons */}
          <div className="flex md:ml-auto md:mr-0 mx-auto items-center flex-shrink-0 space-x-4">
            <button
              className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <p>Page {currentPage}</p>
            <button
              className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
              onClick={() => handlePageChange('next')}
              disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>

    { /*** Section B */}
    <div className="w-1/5 p-5">
      <section className="flex flex-col items-center justify-center min-h-screen">
        <RichTextEditor/>
        <header className="text-gray-600 body-font">
          <div className="container mx-auto flex flex-col items-center justify-center py-5 space-y-4">
            {/* Search Input */}
            <input
              type="text"
              className="border border-gray-200 p-2 w-64"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
            />

            {/* Download Buttons */}
            <div className="flex space-x-4">
              <button
                className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base"
                onClick={handleDownloadPDF}
              >
                Download PDF
              </button>
              <button
                className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base"
                onClick={handleDownloadExcel}
              >
                Download Excel
              </button>
            </div>

            {/* Custom API Input and Button */}
            <div className="flex space-x-4">
              <input
                type="text"
                className="border border-gray-200 p-2"
                placeholder="Input custom API..."
                onChange={(e) => {
                  handleUrlChange(e.target.value);
                }}
              />
              <button
                className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base"
                onClick={handleCustomUrl}
              >
                Custom Table
              </button>
            </div>

            {/* Download All Pages Button */}
            <button
              className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4"
              onClick={handleDownloadAllPages}
            >
              Download All Pages
            </button>
          </div>
        </header>
      </section>
    </div>
  </div>
  <style>
    {`
      table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
      }
    `}
  </style>
</div>

  );
}

export default Index;