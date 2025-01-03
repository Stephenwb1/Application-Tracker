// components/SearchBar.js
import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  // Handle the input change
  const handleInputChange = (event) => {
    setQuery(event.target.value);
    onSearch(event.target.value); // Pass the query to the parent component
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for jobs..."
        value={query}
        onChange={handleInputChange}
        style={{ padding: '8px', fontSize: '16px' }}
      />
    </div>
  );
};

export default SearchBar;
