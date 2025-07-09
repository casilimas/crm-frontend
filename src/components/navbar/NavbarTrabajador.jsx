import React, { useState } from "react";


import Notificacion from "../boton/jefe/Notificacion";
import CerrarSecion from "../boton/jefe/cerrarSecion";
import FinalizarUltimaTarea from "../boton/jefe/FinalizarUltimaTarea";
import ListarTodos from "../boton/trabajador/listarTodos";
import CambiarPassword from "../boton/trabajador/CambiarPassword";


const NavbarTrabajador = () => {
  const [activeForm, setActiveForm] = useState(null);

  const handleToggle = (formName) => {
    setActiveForm((prev) => (prev === formName ? null : formName));
  };

  return (
    <div className="hidden md:block h-auto w-full bg-white px-4 py-2 mt-2 rounded ">
      <div className="grid grid-cols-5 gap-8">
        
       
        <Notificacion activeForm={activeForm} onToggle={handleToggle} />
        <FinalizarUltimaTarea activeForm={activeForm} onToggle={handleToggle} />
        <ListarTodos activeForm={activeForm} onToggle={handleToggle} />
        <CambiarPassword activeForm={activeForm} onToggle={handleToggle} />
         <CerrarSecion activeForm={activeForm} onToggle={handleToggle} />
      </div>
    </div>
  );
};

export default NavbarTrabajador
