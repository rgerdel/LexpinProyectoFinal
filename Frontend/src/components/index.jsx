//src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { AsignaturaProvider } from './AsignaturaContext';
import { UsuarioProvider } from './UsuarioContext';
import App from './App';

ReactDOM.render(
  <AsignaturaProvider>
    <App />
  </AsignaturaProvider>,
  document.getElementById('root')
);

ReactDOM.render(
  <React.StrictMode>
    <UsuarioProvider>
      <App />
    </UsuarioProvider>
  </React.StrictMode>,
  document.getElementById('root')
);