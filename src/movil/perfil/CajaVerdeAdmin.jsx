// ✅ src/movil/perfil/CajaVerde.jsx
import React from "react";
import PerfilAvatarMovil from "./PerfilAvatar";


const CajaVerdeAdmin = () => {
  return (
    <div className="sm:hidden w-full h-auto bg-gray-100 flex flex-row justify-around items-center px-4 py-2">
      <PerfilAvatarMovil />
      
    </div>
  );
};

export default CajaVerdeAdmin;
