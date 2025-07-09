// CajAdminAmarilla.jsx
import React from "react";
import ModuloIntegradoCajaAmarillaAdmin from "../../components/boton/modulosintegrados/ModuloIntegradoCajaAmarillaAdmin"; // Ajusta la ruta si es diferente

const CajAdminAmarilla = () => {
  return (
    <div className="flex-grow md:hidden w-full bg-gray-100 flex items-center px-4 overflow-y-auto">
      {/* ⬇️ Aquí insertamos el componente hijo */}
      <ModuloIntegradoCajaAmarillaAdmin />
    </div>
  );
};

export default CajAdminAmarilla;
