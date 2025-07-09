import React, { useState } from "react";
import RegistrarUsuario from "../boton/admin/RegistrarUsuario";
import CrearTareas from "../boton/admin/crearTareas";
import CrearDepartamento from "../boton/admin/crearDepartamento";
import CambiarStatus from "../boton/admin/cambiarStatus";
import MigrarUsuario from "../boton/admin/migrarUsuario";
import CambiarCorreo from "../boton/admin/cambiarCorreo";
import CambiarPassword from "../boton/admin/CambiarPassword";
import CambiarRolTrabajador from "../boton/admin/CambiarRolTrabajador";
import BorrarDepartamento from "../boton/admin/borrarDepartamento";
import BorrarUsuario from "../boton/admin/BorrarUsuario";
import BorrarTareaPendiente from "../boton/admin/borrarTareaPendiente";
import CerrarSecion from "../boton/jefe/cerrarSecion";
import ListarTodos from "../boton/admin/listarTodos";

const Navbar = () => {
  const [activeForm, setActiveForm] = useState(null);

  const handleToggle = (formName) => {
    setActiveForm((prev) => (prev === formName ? null : formName));
  };

  return (
    <div className="hidden md:block h-auto w-full bg-white px-4 py-2 mt-2 rounded shadow-md">
  <div className="grid grid-cols-7 gap-1 mb-2">
    <RegistrarUsuario activeForm={activeForm} onToggle={handleToggle} />
    <CrearTareas activeForm={activeForm} onToggle={handleToggle} />
    <CrearDepartamento activeForm={activeForm} onToggle={handleToggle} />
    <CambiarStatus activeForm={activeForm} onToggle={handleToggle} />
    <MigrarUsuario activeForm={activeForm} onToggle={handleToggle} />
    <CambiarCorreo activeForm={activeForm} onToggle={handleToggle} />
    
     <CerrarSecion activeForm={activeForm} onToggle={handleToggle} />
  
  </div>

  <div className="grid grid-cols-6 gap-4">
    <CambiarRolTrabajador activeForm={activeForm} onToggle={handleToggle} />
    <BorrarDepartamento activeForm={activeForm} onToggle={handleToggle} />
    <BorrarUsuario activeForm={activeForm} onToggle={handleToggle} />
    <BorrarTareaPendiente activeForm={activeForm} onToggle={handleToggle} />
    <ListarTodos activeForm={activeForm} onToggle={handleToggle} />
    <CambiarPassword activeForm={activeForm} onToggle={handleToggle} />
    
   
   
  </div>
</div>

  );
};

export default Navbar;
