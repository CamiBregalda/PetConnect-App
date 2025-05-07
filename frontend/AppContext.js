import React, { createContext, useState } from 'react';

export const AbrigoContext = createContext({
  currentAbrigoId: undefined, // ou null, ou '' dependendo da sua lógica
  setCurrentAbrigoId: () => {}, // Uma função vazia para evitar erros iniciais
});

export const AbrigoProvider = ({ children }) => {
  const [currentAbrigoId, setCurrentAbrigoId] = useState(null);

  return (
    <AbrigoContext.Provider value={{ currentAbrigoId, setCurrentAbrigoId }}>
      {children}
    </AbrigoContext.Provider>
  );
};