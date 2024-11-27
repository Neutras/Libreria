import React from 'react';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Bienvenido a la Librería</div>} />
    </Routes>
  );
};

export default App;
