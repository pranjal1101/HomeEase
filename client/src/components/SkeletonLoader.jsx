import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ count = 3 }) => {
  const skeletons = Array.from({ length: count });

  return (
    <>
      {skeletons.map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-shimmer skeleton-img"></div>
          <div className="skeleton-shimmer skeleton-category"></div>
          <div className="skeleton-shimmer skeleton-title"></div>
          <div className="skeleton-shimmer skeleton-text"></div>
          <div className="skeleton-shimmer skeleton-text short"></div>
          
          <div className="skeleton-footer">
            <div className="skeleton-shimmer skeleton-price"></div>
            <div className="skeleton-shimmer skeleton-btn"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonLoader;
