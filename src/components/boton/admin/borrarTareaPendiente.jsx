import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

const BorrarTareaPendiente = ({ activeForm, onToggle }) => {
  const { token } = useAuth();
  const [tareas, setTareas] = useState([]);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const isActive = activeForm === 'borrarTareaPendiente';

  // 🔄 Obtener tareas asignadas pendientes
  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const res = await api.get('/tasks/assigned-by-me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTareas(res.data.filter((t) => t.status === 'pendiente'));
      } catch (error) {
        console.error('Error al obtener tareas pendientes', error);
      }
    };

    if (isActive) fetchTareas();
  }, [isActive, token]);

  // 🗑️ Eliminar tarea
  const eliminarTarea = async (id) => {
    try {
      await api.delete(`/tasks/pending/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTareas((prev) => prev.filter((t) => t._id !== id));
      setMessage('✅ Tarea eliminada con éxito');
      onToggle(null); // ⛔ Cierra el formulario
    } catch (error) {
      console.error('Error al eliminar tarea', error);
      setMessage('❌ No se pudo eliminar la tarea');
    }

    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      setMessage('');
    }, 2000);
  };



  return (
    <div className="mb-6 relative">
      {/* 🔘 Botón flotante */}
      <button
        onClick={() => onToggle(isActive ? null : 'borrarTareaPendiente')}
        title="Borrar tareas pendientes"
className="flex flex-col items-center bg-blue-400 text-black p-2 rounded w-20 hover:bg-blue-500 transition-all duration-500 ease-in-out"
      >
        <div className="relative group">
          <Trash2 size={16} className="transition-transform group-hover:scale-110" />
        </div>
        <span className="text-[10px] mt-1">Borrar tareas</span>
      </button>

      {/* 📩 Mensaje emergente */}
      {showMessage && (
        <div className="absolute top-[120%] left-0 bg-yellow-100 border border-yellow-600 text-yellow-800 text-sm rounded px-4 py-2 shadow-md w-[300px] z-50">
          {message}
        </div>
      )}

      {/* 📋 Lista de tareas */}
      {isActive && (
        <div className="absolute top-[150%] left-0 z-50 bg-white p-4 text-black rounded shadow-md w-[300px] max-h-[400px] overflow-y-auto">
          <h2 className="text-sm font-bold mb-2">Tareas pendientes asignadas por ti</h2>
          {tareas.length === 0 ? (
            <p className="text-xs">No hay tareas pendientes asignadas por ti.</p>
          ) : (
            <ul className="space-y-2 text-xs">
              {tareas.map((tarea) => (
                <li key={tarea._id} className="border p-2 rounded flex justify-between items-center">
                  <div className="w-[70%]">
                    <p className="font-semibold">{tarea.title}</p>
                    <p className="text-[11px] text-blue-700">
                      Asignada a: <span className="font-semibold">{tarea.assignedTo?.name || 'Desconocido'}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => eliminarTarea(tarea._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default BorrarTareaPendiente;
