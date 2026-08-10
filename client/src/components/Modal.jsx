import React, { useEffect } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, footerButtons }) => {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        
        <div className="modal-header">
          <h3>{title}</h3>
        </div>

        <div className="modal-body">
          {children}
        </div>

        {footerButtons && (
          <div className="modal-footer">
            {footerButtons}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
