// src/components/AsignarutaContext.jsx

import React, { createContext, useState, useEffect } from 'react';

export const AsignaturaContext = createContext();

export const AsignaturaProvider = ({ children }) => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAsignaturas = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/asignaturas/detalles");
      if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
      }
      const data = await response.json();
      setAsignaturas(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener las asignaturas con detalles:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsignaturas();
  }, []);

  return (
    <AsignaturaContext.Provider value={{ asignaturas, setAsignaturas, loading, error }}>
      {children}
    </AsignaturaContext.Provider>
  );
};