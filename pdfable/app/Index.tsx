'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import { fetchData } from './lib';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

import * as XLSX from 'xlsx';

const Index = () => {
	const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(data);

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


  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const table = document.getElementById('income_table');
    const header = document.getElementById('header');

    if(header) {
      const headerText = header.textContent.trim()

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

	const handleSearch = (term: string) => {
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

  const offset = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(offset, offset + itemsPerPage);

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

  return (
		<>
			<section className="text-gray-600 body-font">
        <div className="container px-5 py-5 mx-auto">
          <div className="flex flex-col text-center w-full">
            <h1 
              id='header'
              className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Alpha Vantage Income Statement
            </h1>
          </div>
        </div>
      </section>
      <section>
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap items-center justify-between py-5">
          <input
            //type="text"
            className="border border-gray-200 p-2 mx-5"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
          />
          <div className="lg:w-2/5 flex justify-end space-x-4">
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
        </div>
      </header>
      </section>
			<section className='mx-auto flex justify-center'>
				<div>
          <table 
            id="income_table"
            >

            
						{/************* Maps over the entire table fetches keys form the json and updates the table accordingly
             * 
             * <thead>
              <tr>
                {data.length > 0 && Object.keys(data[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
						</thead>
						<tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, index) => (
                  <td key={index}>{value !== undefined ? value : '-'}</td>
                ))}
              </tr>
            ))}

          </tbody>
          
          **/}

          <thead>
							<tr>
								<th>Fiscal Date Ending</th>
								<th>Gross Profit</th>
								<th>Total Revenue</th>
								<th>Operating Income</th>
								<th>Net Income</th>
							</tr>
						</thead>
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
					</table>
				</div>
			</section>
    
      <section className="text-gray-600 body-font py-8">
        <div className="container px-5 mx-auto flex items-center md:flex-row flex-col">
          <div className="flex flex-col md:pr-10 md:mb-0 mb-6 pr-0 w-full md:w-auto md:text-left text-center">
            <h6 className="md:text-xs text-gray-900">https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=IBM&apikey=demo</h6>
          </div>
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
}

export default Index;
