import React, { useState } from "react";
import CrearTareas from "../boton/jefe/crearTareas";
import BorrarTareaPendiente from "../boton/jefe/borrarTareaPendiente";
import Notificacion from "../boton/jefe/Notificacion";
import CerrarSecion from "../boton/jefe/cerrarSecion";
import FinalizarUltimaTarea from "../boton/jefe/FinalizarUltimaTarea";
import ListarTodos from "../boton/jefe/listarTodos";
import CambiarPassword from "../boton/jefe/CambiarPassword";

const NavbarJefe = () => {
  const [activeForm, setActiveForm] = useState(null);

  const handleToggle = (formName) => {
    setActiveForm((prev) => (prev === formName ? null : formName));
  };

  return (
<div className="hidden md:flex h-[190px] w-full bg-white overflow-x-auto items-center justify-start ml-4">
  <div className="grid grid-cols-7 gap-8">


        <CrearTareas activeForm={activeForm} onToggle={handleToggle} />
        <BorrarTareaPendiente activeForm={activeForm} onToggle={handleToggle} />
        <Notificacion activeForm={activeForm} onToggle={handleToggle} />
        <FinalizarUltimaTarea activeForm={activeForm} onToggle={handleToggle} />
        <ListarTodos activeForm={activeForm} onToggle={handleToggle} />
        <CambiarPassword activeForm={activeForm} onToggle={handleToggle} />
        <CerrarSecion activeForm={activeForm} onToggle={handleToggle} />
        
        
      </div>
    </div>
  );
};

export default NavbarJefe;
