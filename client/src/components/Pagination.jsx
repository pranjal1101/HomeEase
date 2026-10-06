import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, onPageChange, totalItems, itemsPerPage = 6 }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <button 
        className="pagination-btn" 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        &laquo;
      </button>

      {pageNumbers.map(number => (
        <button 
          key={number} 
          className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}

      <button 
        className="pagination-btn" 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;
