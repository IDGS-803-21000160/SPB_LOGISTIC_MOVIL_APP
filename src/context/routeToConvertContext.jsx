// Contexto para compartir datos
import React, { createContext, useContext, useState } from "react";

const RutaContext = createContext();

export const RutaProvider = ({ children }) => {
  const [rutaData, setRutaData] = useState(null);

  return (
    <RutaContext.Provider value={{ rutaData, setRutaData }}>
      {children}
    </RutaContext.Provider>
  );
};

export const useRuta = () => {
  const context = useContext(RutaContext);
  if (!context) {
    throw new Error("useRuta must be used within a RutaProvider");
  }
  return context;
};
