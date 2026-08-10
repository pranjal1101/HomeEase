import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = 'Search for services...' }) => {
  const [value, setValue] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form className="search-bar-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="form-control search-bar-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="btn btn-primary search-bar-btn">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
