import React, {useState} from 'react'
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import jsPDFInvoiceTemplate from 'jspdf-invoice-template';
import { renderValue } from './lib';
import * as XLSX from 'xlsx';

import { useSharedState } from '../components/StateStore';


const DownloadBtns = () => {
  const { selectedColumns, url,urlData, setUrlData, logo, address, footer} = useSharedState();

  const OutputType = {
    Save: "save", //save pdf as a file
    DataUriString: "datauristring", //returns the data uri string
    DataUri: "datauri", //opens the data uri in current window
    DataUrlNewWindow: "dataurlnewwindow", //opens the data uri in new window
    Blob: "blob", //return blob format of the doc,
    ArrayBuffer: "arraybuffer", //return ArrayBuffer format
  };

  const generatePDF = () => {
    const props = {
      outputType: OutputType || "save",
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
        invGenDate: `Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        headerBorder: true,
        tableBodyBorder: false,
        header: selectedColumns.map(column => ({ title: column })),
        table: urlData.map(item => selectedColumns.map(column => renderValue(item[column]))),
        additionalRows: [],
        invDescLabel: "",
        invDesc: "",
      },
      footer: {
        text: footer || "Disclaimer",
        pageEnable: true
      },
      pageEnable: true, // Enable page numbering and footer display
      pageLabel: "Page", // Label for page numbering
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
