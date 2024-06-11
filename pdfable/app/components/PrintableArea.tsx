import React from 'react'
import Header from './Header';
import Footer from './Footer';
import Index from '../Index';
import SearchBar from './SearchBar';

const PrintableArea = () => {
  return (
    <div className="design">
      <div className="a4-paper">
        <div><Header /></div>
        <div><Index /></div>
        <div><Footer /></div>
      </div>
      <div className="right-side">
        <div>
        <div className="">
          <SearchBar />
        </div>
        </div>
      </div>
    </div>
  );
}

export default PrintableArea