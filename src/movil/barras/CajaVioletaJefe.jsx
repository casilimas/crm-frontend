// ✅ src/movil/barras/CajaVioletaTrabajador.jsx
import React from "react";
import BarraDeslizableJefe from "./BarrasDeslizableJefe";

const CajaVioletajefe = () => {
  return (
    <div className=" md:hidden w-full h-[100px] bg-white flex items-center px-4">
      <BarraDeslizableJefe />
    </div>
  );
};

export default CajaVioletajefe;
