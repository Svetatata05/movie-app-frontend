import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSearch = () => {
    onSearch(inputValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Пошук за назвою, актором або роком"
        style={{ width: '100%', maxWidth: 400, padding: 8, marginRight: 10 }}
      />
      <button onClick={handleSearch}>Пошук</button>
    </div>
  );
};

export default SearchBar;
