'use client'

import React, { useState } from 'react';
import 'jspdf-autotable';
import jsPDFInvoiceTemplate from 'jspdf-invoice-template';
import * as XLSX from 'xlsx';
import { useSharedState } from '../components/StateStore';

const DownloadBtns = () => {
  const {
    filteredData,
    headers,
    setHeaders,
    urlData, //Url Data to Json
    logo,
    address,
    footer,
    endDate,
    startDate,
    accountNumber,
    setFilteredData,
    columnVisibility,
    currentItems
  } = useSharedState();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

/***Download Current page */
  {/*****const table = tableRef.current;
    if (!table) {
      console.error('Table element not found');
      return;
    }

    // Get headers from the table
    const headers = Array.from(table.querySelectorAll('thead th')).map((headerCell) =>
      headerCell.textContent.trim()
    );

    // Get table data
    const tableData = Array.from(table.querySelectorAll('tbody tr')).map((row) =>
      Array.from(row.cells).map((cell) => cell.textContent.trim())
    ); */}
  const OutputType = {
    Save: 'save', // save pdf as a file
    DataUriString: 'datauristring', // returns the data uri string
    DataUri: 'datauri', // opens the data uri in current window
    DataUrlNewWindow: 'dataurlnewwindow', // opens the data uri in new window
    Blob: 'blob', // return blob format of the doc,
    ArrayBuffer: 'arraybuffer', // return ArrayBuffer format
  };

  const generatePDF = async (useClient, outputType = OutputType.Save) => {
    const tableData = useClient ? urlData : filteredData;

    if (!(headers && headers.length > 0 && tableData && tableData.length > 0)) {
      alert('No table to print');
      return;
    }

    const { visibleHeaders, visibleData } = getVisibleTableData();

    const props = {
      outputType,
      fileName: 'Invoice_Header',
      returnJsPDFDocObject: true,
      orientationLandscape: false,
      compress: true,
      logo: {
        src: logo ? URL.createObjectURL(logo) : null,
        type: 'PNG',
        width: 53.33,
        height: 26.66,
        margin: { top: 0, left: 0 },
      },
      business: {
        address,
      },
      invoice: {
        invGenDate: `Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        headerBorder: true,
        tableBodyBorder: false,
        header: visibleHeaders.map((header) => ({ title: header })),
        table: visibleData,
        additionalRows: [],
        invDescLabel: '',
        invDesc: '',
      },
      footer: {
        text: footer || 'Disclaimer',
        pageEnable: true,
      },
      pageEnable: true,
      pageLabel: 'Page',
    };

    try {
      const pdfObject = jsPDFInvoiceTemplate(props);
      const { jsPDFDocObject } = pdfObject;

      if (outputType === OutputType.Blob) {
        // Convert generated PDF to Blob
        const pdfBuffer = jsPDFDocObject.output('arraybuffer');
        const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });

        return pdfBlob;      
      } else {
        jsPDFDocObject.save('Account_Statement.pdf');
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const getVisibleTableData = () => {
    const visibleHeaders = headers.filter(header => columnVisibility[header]);
    const visibleData = currentItems.map(item => item.filter((cell, colIndex) => columnVisibility[headers[colIndex]]));

    return { visibleHeaders, visibleData };
  };

  const handleGeneratePdf = (useClient) => {
    const tableData = useClient ? urlData : filteredData;

    if (!(headers && headers.length > 0 && tableData && tableData.length > 0)) {
      alert('No table to print');
      return;
    }
    
    generatePDF(useClient, OutputType.Save);
  };


  // Library to download xlsx file
  const handleDownloadExcel = (useClient) => {
    const table = document.getElementById('income_table');
    const headerElement = document.getElementById('header');
  
    if (table && headerElement) {
      const headerText = headerElement.textContent.trim();
      const headers = Array.from(table.querySelectorAll('thead th')).map((headerCell) =>
        headerCell.textContent.trim()
      );
      const tableData = Array.from(table.querySelectorAll('tbody tr')).map((row) =>
        Array.from(row.cells).map((cell) => cell.textContent.trim())
      );
  
      // Create a new workbook and add a worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([headers, ...tableData]);
  
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
      // Convert workbook to binary Excel file (xlsx format)
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
      if (useClient) {
        return excelBlob;
      } else {
        // Trigger download if useClient is false
        const link = document.createElement('a');
        link.href = URL.createObjectURL(excelBlob);
        link.setAttribute('download', 'tabledata.xlsx');
        document.body.appendChild(link);
        link.click();
  
        // Cleanup
        document.body.removeChild(link);
      }
    } else {
      alert('No table found')
      console.error('Table or header element not found');
    }
  };
  

  const handleDownloadFilter = async () => {
    if (!accountNumber || !startDate || !endDate) {
      alert('Please perform a search with valid account number, start date, and end date.');
      return;
    }

    try {
      const startDateFormatted = `${startDate.getFullYear()}-${(
        '0' +
        (startDate.getMonth() + 1)
      ).slice(-2)}-${('0' + startDate.getDate()).slice(-2)}`;
      const endDateFormatted = `${endDate.getFullYear()}-${(
        '0' +
        (endDate.getMonth() + 1)
      ).slice(-2)}-${('0' + endDate.getDate()).slice(-2)}`;

      const queryString = `account_number=${accountNumber}&start_date=${startDateFormatted}&end_date=${endDateFormatted}`;

      const response = await fetch(`http://localhost:5000/api/search?${queryString}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const { headers, data } = await response.json();

      console.log('Filtered Data:', { headers, data });

      setHeaders(headers);
      setFilteredData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Please try again.');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendEmail = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
  
    try {
      const pdfBlob = await generatePDF(true, OutputType.Blob);
      const excelBlob = handleDownloadExcel(true);
  
      const formData = new FormData();
      formData.append('pdf', pdfBlob, 'Account_Statement.pdf');
      formData.append('excel', excelBlob, 'Account_Statement.xlsx');

      formData.append('toEmail', email);
      formData.append('subject', `Statement for ${accountNumber}`);
      formData.append('textContent', 'Please find attached Statement and Table Data.');
      formData.append('htmlContent', '<p>Please find attached your invoice and table data.</p>');
  
      const response = await fetch('http://localhost:5000/api/send-email', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Failed to send email: ${response.status}`);
      }
  
      const result = await response.json();
      alert(result.message); // Display success message
      setError('');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email. Please try again.');
    }
  };
  

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-4 p-5">
        <button
          className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base"
          onClick={handleDownloadFilter}
        >
          Search
        </button>
        <button
          className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base"
          onClick={() => handleGeneratePdf(false)}
        >
          Download PDF
        </button>
      </div>

      <div className="flex space-x-4 p-5">
        <button
          className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base"
          onClick={() => handleGeneratePdf(true)}
        >
          Download Full Statement
        </button>
        <button
          className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base"
          onClick={() => handleDownloadExcel(false)}
        >
          Download Excel
        </button>
      </div>

      <div className="flex flex-row space-y-4">
        <input
          type="email"
          className="border border-gray-200 p-2 mx-2"
          placeholder="Enter email address"
          value={email}
          onChange={handleEmailChange}
        />
        <button
          className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base"
          onClick={handleSendEmail}
        >
          Send to Email
        </button>
      </div>
    </div>
  );
};

export default DownloadBtns;
