'use client'

import React, {useState} from 'react'
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import jsPDFInvoiceTemplate from 'jspdf-invoice-template';
import { renderValue } from './lib';
import * as XLSX from 'xlsx';

import { useSharedState } from '../components/StateStore';

const DownloadBtns = () => {
  const { 
    filteredData, 
    headers, 
    setHeaders,
    urlData, 
    logo, 
    address, 
    footer,
    endDate, 
    startDate,
    accountNumber,
    setFilteredData  
   } = useSharedState();


  const OutputType = {
    Save: "save", //save pdf as a file
    DataUriString: "datauristring", //returns the data uri string
    DataUri: "datauri", //opens the data uri in current window
    DataUrlNewWindow: "dataurlnewwindow", //opens the data uri in new window
    Blob: "blob", //return blob format of the doc,
    ArrayBuffer: "arraybuffer", //return ArrayBuffer format
  };


  const generatePDF = (useClient) => {
    const tableData = useClient ? urlData : filteredData;
  
    const props = {
      outputType: OutputType.Save,
      fileName: "Invoice_Header",
      returnJsPDFDocObject: true,
      orientationLandscape: false,
      compress: true,
      logo: {
        src: logo ? URL.createObjectURL(logo) : null,
        type: 'PNG',
        width: 53.33,
        height: 26.66,
        margin: { top: 0, left: 0 }
      },
      business: {
        address
      },
      invoice: {
        invGenDate: `Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        headerBorder: true,
        tableBodyBorder: false,
        header: headers.map(header => ({ title: header })),
        table: tableData,
        additionalRows: [],
        invDescLabel: "",
        invDesc: "",
      },
      footer: {
        text: footer || "Disclaimer",
        pageEnable: true
      },
      pageEnable: true,
      pageLabel: "Page",
    };
  
    try {
      const pdfObject = jsPDFInvoiceTemplate(props);
      const { jsPDFDocObject } = pdfObject;
      jsPDFDocObject.save("Invoice_Header.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
  
  
// Library to download xlsx file
const handleDownloadExcel = () => {
  const table = document.getElementById('income_table');
  const headerElement = document.getElementById('header');

  if (table && headerElement) {

    //alert no headertext
    const headerText = headerElement.textContent.trim();

    const headers = Array.from(table.querySelectorAll('thead th')).map(headerCell => headerCell.textContent.trim());

    const tableData = Array.from(table.querySelectorAll('tbody tr')).map(row => {
      return Array.from(row.cells).map(cell => cell.textContent.trim());
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

    // Create anchor tag and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'tabledata.xlsx');
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
  } else {
    console.error('Table or header element not found');
  }
}

const handleDownloadFilter = async () => {
  if (!accountNumber || !startDate || !endDate) {
    alert('Please perform a search with valid account number, start date, and end date.');
    return;
  }

  console.log('Account Number', accountNumber);
  console.log('Start Date', startDate);
  console.log('End Date', endDate);

  try {
    const startDateFormatted = `${startDate.getFullYear()}-${('0' + (startDate.getMonth() + 1)).slice(-2)}-${('0' + startDate.getDate()).slice(-2)}`;
    const endDateFormatted = `${endDate.getFullYear()}-${('0' + (endDate.getMonth() + 1)).slice(-2)}-${('0' + endDate.getDate()).slice(-2)}`;

    const queryString = `account_number=${accountNumber}&start_date=${startDateFormatted}&end_date=${endDateFormatted}`;
    console.log("Query String:", queryString);

    const response = await fetch(`http://localhost:3001/api/search?${queryString}`);

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



	return (
		<div className='flex flex-col items-center'>
      <div className="flex space-x-4 p-5">
        <button
            className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base"
            onClick={() => {
              handleDownloadFilter(); 
            }}
          >
            Search
          </button>
          <button
            className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base"
            onClick={() => generatePDF(true)}>
          Download PDF
        </button>
        <button
            className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base"
            onClick={() => {}}>
          Send to Email
        </button>
      </div>
      {/* Container for the other two buttons */}
      <div className="flex space-x-4 p-5">
        <button
          className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base"
          onClick={() => generatePDF(true)}
        >
          Download Full Statement
        </button>
        <button
          className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base"
          onClick={handleDownloadExcel}
        >
          Download Excel
        </button>
      </div>
    </div>

    )
  }

export default DownloadBtns
