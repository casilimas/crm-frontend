// ✅ src/movil/barras/CajaVioletaTrabajador.jsx
import React from "react";
import BarraDeslizableadmin from "./BarraDeslizableAdmin";

const CajaVioletaAdmin = () => {
  return (
    <div className=" md:hidden w-full h-[100px] bg-gray-100 flex items-center px-4">
      <BarraDeslizableadmin />
    </div>
  );
};

export default CajaVioletaAdmin;
