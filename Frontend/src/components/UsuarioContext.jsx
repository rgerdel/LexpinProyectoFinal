// src/components/UsuarioContext.jsx

import React, { createContext, useState, useContext } from "react";

const UsuarioContext = createContext();

export const useUsuario = () => useContext(UsuarioContext);

export const UsuarioProvider = ({ children }) => {
  const [usuarioActual, setUsuarioActual] = useState(null);

  return (
    <UsuarioContext.Provider value={{ usuarioActual, setUsuarioActual }}>
      {children}
    </UsuarioContext.Provider>
  );
};
