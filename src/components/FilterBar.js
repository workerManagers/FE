import React from 'react';
import styles from '../styles/JobPost.module.css';

const FilterBar = ({ locationFilter, typeFilter, onLocationChange, onTypeChange }) => {
  return (
    <div className={styles.filterBar}>
      <select value={locationFilter} onChange={onLocationChange}>
        <option value="">전체 지역</option>
        <option value="서울">서울</option>
        <option value="부산">부산</option>
        <option value="인천">인천</option>
        <option value="대구">대구</option>
      </select>
      <select value={typeFilter} onChange={onTypeChange}>
        <option value="">전체 고용형태</option>
        <option value="정규직">정규직</option>
        <option value="계약직">계약직</option>
        <option value="인턴">인턴</option>
      </select>
    </div>
  );
};

export default FilterBar; 