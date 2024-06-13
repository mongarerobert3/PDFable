'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Rnd } from 'react-rnd';
import { useSharedState } from '../components/StateStore';

const Header = () => {
  const { logo, setLogo, address, setAddress} = useSharedState();

  const [title, setTitle] = useState('');

  const handleLogoChange = (file) => {
    setLogo(file);
  };

  return (
    <div id="header-container">
      <section 
        className="text-gray-600 body-font mb-5" 
        style={{ height: '150px', position: 'relative', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}
      >
        <div className="container p-5 mx-auto" style={{ height: '100%' }}>
          <div className="flex flex-row items-center justify-between" style={{ height: '100%' }}>
            {/* Logo Upload */}
            <Rnd
              default={{
                x: 0,
                y: 0,
                width: 100,
                height: 100,
              }}
              bounds="parent"
              enableResizing={{ top: false, right: true, bottom: true, left: false, topRight: true, bottomRight: true, bottomLeft: true, topLeft: true }}
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex items-center justify-center rounded" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', border: logo ? 'none' : '1px solid gray' }}>
                  {logo ? (
                    <Image
                      src={URL.createObjectURL(logo)}
                      alt="Uploaded Logo"
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLogoChange(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </label>
            </Rnd>

            {/* Title Input 
            <Rnd
              default={{
                x: 120,
                y: 0,
                width: 300,
                height: 100,
              }}
              bounds="parent"
              enableResizing={{ top: false, right: true, bottom: true, left: true, topRight: true, bottomRight: true, bottomLeft: true, topLeft: true }}
            >
              <textarea
                id="header"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                className="p-2 rounded focus:outline-none address-input"
                style={{ width: '100%', height: '100%', resize: 'both', overflow: 'auto', border: title ? 'none' : '1px solid gray' }}
              />
            </Rnd>*/}

            {/* Address Input */}
            <Rnd
              default={{
                x: 450,
                y: 0,
                width: 300,
                height: 100,
              }}
              bounds="parent"
              enableResizing={{ top: false, right: true, bottom: true, left: true, topRight: true, bottomRight: true, bottomLeft: true, topLeft: true }}
            >
              <textarea
                id='address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address and contacts"
                className="p-2 rounded focus:outline-none address-input"
                style={{ width: '70%', height: '100%', resize: 'both', overflow: 'auto', border: address ? 'none' : '1px solid gray' }}
              />
            </Rnd>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Header;
