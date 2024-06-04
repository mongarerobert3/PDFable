'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';

type character = {
  id: number;
  Timestamp: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
};

const Index = () => {
  const [search, setSearch] = useState('');
  const [character, setCharacter] = useState<character[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo');
        setCharacter(response.data);
				//console.log("Characters", response.data);
      } catch (error) {
        console.log('Fetch Error', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (direction: string) => {
    if (direction === 'next' && currentPage < Math.ceil(character.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const offset = (currentPage - 1) * itemsPerPage;
  const currentCharacters = character.slice(offset, offset + itemsPerPage);

  return (
    <>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-10 mx-auto">
          <div className="flex flex-col text-center w-full mb-5">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Harry Potter Characters</h1>
          </div>
        </div>
      </section>
      <section>
        <header className="text-gray-600 body-font">
          <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <nav className="flex lg:w-2/5 flex-wrap items-center text-base md:ml-auto">
              <a className="mr-5 hover:text-gray-900">First Link</a>
              <a className="mr-5 hover:text-gray-900">Second Link</a>
            </nav>
            <input
              type="text"
              className="border border-gray-200"
              placeholder="Search for a character..."
              value={search}
              onChange={handleChange}
            />
            <div className="lg:w-2/5 inline-flex lg:justify-end ml-5 lg:ml-0">
              <button
                className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                Download PDF
              </button>
            </div>
          </div>
        </header>
      </section>
      <section className='px-5'>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
				{currentCharacters.map((character) => (
					<div className="" key={character.id}>
						<table className="financial-table">
							<thead>
								<tr>
									<th>Timestamp</th>
									<th>Open</th>
									<th>High</th>
									<th>Low</th>
									<th>Close</th>
									<th>Volume</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>{character.Timestamp}</td>
									<td>{character.Open}</td>
									<td>{character.High}</td>
									<td>{character.Low}</td>
									<td>{character.Close}</td>
									<td>{character.Volume}</td>
								</tr>
							</tbody>
						</table>
					</div>
				))}
			</div>

      </section>
      <section className="text-gray-600 body-font py-8">
        <div className="container px-5 mx-auto flex items-center md:flex-row flex-col">
          <div className="flex flex-col md:pr-10 md:mb-0 mb-6 pr-0 w-full md:w-auto md:text-left text-center">
            <h1 className="md:text-3xl font-medium title-font text-gray-900">Harry Potter Characters</h1>
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
              disabled={currentPage === Math.ceil(character.length / itemsPerPage)}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Index;
