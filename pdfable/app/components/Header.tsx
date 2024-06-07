'use client';

import React from 'react';

const Header = ({ title }) => (
  <section className="text-gray-600 body-font">
    <div className="container px-5 py-5 mx-auto">
      <div className="flex flex-col text-center w-full">
        <h1 id="header" className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">{title}</h1>
      </div>
    </div>
  </section>
);

export default Header;
