import React from 'react';
import styles from '../styles/JobPost.module.css';

const SearchBar = ({ searchTerm, onSearch }) => {
  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={searchTerm}
        onChange={onSearch}
      />
    </div>
  );
};

export default SearchBar; 