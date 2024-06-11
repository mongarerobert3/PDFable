import React from 'react'
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import * as XLSX from 'xlsx';

const DownloadBtns = () => {
	// Library to download pdf file
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const table = document.getElementById('income_table');
    const header = document.getElementById('header');
  
    if (header) {
      const titleText = document.getElementById('title')?.value || '';
      const addressText = document.getElementById('address')?.value || '';
  
      // Logo
      const logoImage = document.getElementById('file-upload');

      if (logoImage && logoImage.files && logoImage.files[0]) {
        const reader = new FileReader();
        reader.onload = () => {
          const logoDataURL = reader.result;
          doc.addImage(logoDataURL, 'PNG', 15, 15, 30, 30); // Adjust coordinates and dimensions as needed
  
          // Title
          doc.setFontSize(16);
          doc.text(titleText || '', 50, 25); // Adjust coordinates as needed
  
          // Address
          doc.setFontSize(12);
          doc.text(addressText || '', 50, 40); // Adjust coordinates as needed
  
          const startY = 60; // Adjust the starting position as needed
  
          // Extract table header
          const headers = [];
          Array.from(table?.querySelectorAll('thead th')).forEach(headerCell => {
            headers.push(headerCell.textContent?.trim());
          });
  
          // Extract table data
          const tableData = [];
          Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
            const rowData = [];
            Array.from(row.cells).forEach(cell => {
              rowData.push(cell.textContent.trim());
            });
            tableData.push(rowData);
          });
  
          // Add table to PDF
          doc.autoTable({
            head: [headers],
            body: tableData,
            startY: startY,
          });
  
          // Download PDF
          doc.save('header.pdf');
        };
        reader.readAsDataURL(logoImage.files[0]);
      } else {
        console.error('Logo not found');
      }
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
		<div>
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
			{/* Download All Pages Button */}
			<button
				className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4"
				onClick={handleDownloadAllPages}
			>
				Download All Pages
			</button>
		</div>
	)
}

export default DownloadBtns