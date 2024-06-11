'use client';

import React, {useState} from 'react'

const Footer = () => {
	const [currentPage, setCurrentPage] = useState(1);

	const itemsPerPage = 25;

	const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < Math.ceil(data.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const offset = (currentPage - 1) * itemsPerPage;
  //const currentData = data.slice(offset, offset + itemsPerPage);

	return (
		<>
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
              //disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
            >
              Next
            </button>
          </div>
        </div>
      </section>

		</>
	)
}

export default Footer