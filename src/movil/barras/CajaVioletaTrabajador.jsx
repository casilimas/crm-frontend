// ✅ src/movil/barras/CajaVioletaTrabajador.jsx
import React from "react";
import BarraDeslizableTrabajador from "./BarraDeslizableTrabajador";

const CajaVioletaTrabajador = () => {
  return (
    <div className=" md:hidden w-full h-[100px] bg-white flex items-center px-4">
      <BarraDeslizableTrabajador />
    </div>
  );
};

export default CajaVioletaTrabajador;
