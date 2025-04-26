import React, { createContext, useState } from 'react';

export const AbrigoContext = createContext(null);

export const AbrigoProvider = ({ children }) => {
  const [currentAbrigoId, setCurrentAbrigoId] = useState(null);

  return (
    <AbrigoContext.Provider value={{ currentAbrigoId, setCurrentAbrigoId }}>
      {children}
    </AbrigoContext.Provider>
  );
};