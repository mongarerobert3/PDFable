import React, {useState} from 'react'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import jsPDFInvoiceTemplate from 'jspdf-invoice-template';
import { renderValue } from './lib';

import { useSharedState } from '../components/StateStore';


const DownloadBtns = () => {
  const { selectedColumns, url,urlData, setUrlData, logo, address, footer} = useSharedState();

  const generatePDF = () => {
    const props = {
      outputType: 'save',
      fileName: "Invoice_Header",
      returnJsPDFDocObject: true,
      orientationLandscape: false,
      compress: true,
      logo: {
        src: logo ? URL.createObjectURL(logo) : null,
        type: 'PNG', 
        width: 53.33, 
        height: 26.66,
        margin: {
          top: 0, 
          left: 0 
        }
      },
      business: {
        address
      },
      invoice: {
        invDate: "Payment Date: 01/01/2021 18:12",
        invGenDate: "Invoice Date: 02/02/2021 10:17",
        headerBorder: true,
        tableBodyBorder: false,
        header: selectedColumns.map(column => ({ title: column, style: { width: 30 } })),
        table: urlData.map(item => selectedColumns.map(column => renderValue(item[column]))),
        additionalRows: [],
        invDescLabel: "",
        invDesc: "",
      },
      footer: {
        text: "The invoice is created on a computer and is valid without the signature and stamp.",
        pageEnable: true, 
    },
      pageEnable: false,
      pageLabel: "",
    };

    const pdfObject = jsPDFInvoiceTemplate(props);
    const { jsPDFDocObject } = pdfObject;
    jsPDFDocObject.save("Invoice_Header.pdf");
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


	return (
		<div>
			{/* Download Buttons */}
			<div className="flex space-x-4">
				<button
					className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base"
					onClick={generatePDF}
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
	)
}

export default DownloadBtns
