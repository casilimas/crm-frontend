import React, { createContext, useContext, useState } from "react";

const ActualizacionContext = createContext();

export const useActualizacion = () => useContext(ActualizacionContext);

const ActualizacionProvider = ({ children }) => {
  const [refrescar, setRefrescar] = useState(false);

  const toggleRefrescar = () => {
    setRefrescar((prev) => !prev);
  };

  return (
    <ActualizacionContext.Provider value={{ refrescar, toggleRefrescar }}>
      {children}
    </ActualizacionContext.Provider>
  );
};

export default ActualizacionProvider;
