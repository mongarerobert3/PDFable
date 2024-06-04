'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Image from 'next/image';

type Wand = {
  wood: string;
  core: string;
  length: number;
};

type character = {
  id: string;
  name: string;
  alternate_names: string[];
  species: string;
  gender: string;
  house: string;
  dateOfBirth: string;
  yearOfBirth: number;
  wizard: boolean;
  ancestry: string;
  eyeColour: string;
  hairColour: string;
  wand: Wand;
  patronus: string;
  hogwartsStudent: boolean;
  hogwartsStaff: boolean;
  actor: string;
  alternate_actors: string[];
  alive: boolean;
  image: string;
};

const Index = () => {
	const [search, setSearch] = useState('');
	const [character, setCharacter] = useState<character[]>([]);


	useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://hp-api.onrender.com/api/characters');
        setCharacter(response.data);
      } catch (error) {
        console.log('Fetch Error', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event) => {
    setSearch(event.target.value);
  };

	return (
		<>
			<section className="text-gray-600 body-font">
					<div className="container px-5 py-10 mx-auto">
						<div className="flex flex-col text-center w-full mb-5">
							<h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Harry Porter Characters</h1>
							</div>
							<div className='py-20'>
								<div>
									<i className="fa-solid fa-table"></i>
								</div>
								<input
									type="text"
									className="form-control border-solid border-black"
									placeholder="Search for a location..."
									value={search}
									onChange={handleChange}
								/>
								<button 
									className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Download PDF
								</button>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{character.map((character, index) => (
									<div className="p-2 lg:w-1/3 md:w-1/2 w-full" key={character.id}>
										<div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
											<Image
												alt="team"
												className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
												src={character.image}
												width={64}
												height={64}
											/>
											<div className="flex-grow">
												<h2 className="text-gray-900 title-font font-medium">{character.name}</h2>
												<p className="text-gray-500">{character.alternate_names.join(", ")}</p>
											</div>
										</div>
									</div>
								))}
							</div>
					</div>
				</section>
				<section className="text-gray-600 body-font">
					<div className="container px-5 mx-auto flex items-center md:flex-row flex-col mb-5">
						<div className="flex flex-col md:pr-10 md:mb-0 mb-6 pr-0 w-full md:w-auto md:text-left text-center">
							<h1 className="md:text-3xl text-2xl font-medium title-font text-gray-900">Harry Porter Characters</h1>
						</div>
						<div className="flex md:ml-auto md:mr-0 mx-auto items-center flex-shrink-0 space-x-4">
						<button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Prev
								<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
									<path d="M5 12h14M12 5l7 7-7 7"></path>
								</svg>
							</button>
							<button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Next
								<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
									<path d="M5 12h14M12 5l7 7-7 7"></path>
								</svg>
							</button>
						</div>
					</div>
			</section>
		</>
	)
}

export default Index