// src/components/Modal.jsx
import React from 'react';
import './Modal.css'; // Importa los estilos del modal

const Modal = ({ isOpen, onRequestClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close-button" onClick={onRequestClose}>
          <i className="fas fa-times"></i>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;