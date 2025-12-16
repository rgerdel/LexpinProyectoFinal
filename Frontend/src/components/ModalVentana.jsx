// src/components/ModalVentana.jsx
import React from 'react';

const ModalVentana = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <p className="text-center text-xs text-gray-700 p-5">{message}</p>
                <button
                    className="center bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs"
                    onClick={onClose}
                >
                    <i class="fa-solid fa-arrow-rotate-left"></i> Aceptar y regresar
                </button>
            </div>
        </div>
    );
};

export default ModalVentana;