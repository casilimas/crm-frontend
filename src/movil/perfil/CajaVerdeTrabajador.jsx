// ✅ src/movil/perfil/CajaVerde.jsx
import React from "react";
import PerfilAvatarMovil from "./PerfilAvatar";
import CartaEstadisticaUsuario from "./CartaEstadisticaUsuario";

const CajaVerde = () => {
  return (
    <div className="sm:hidden w-full h-auto bg-black flex flex-row justify-around items-center px-4 py-2">
      <PerfilAvatarMovil />
      <CartaEstadisticaUsuario />
    </div>
  );
};

export default CajaVerde;
