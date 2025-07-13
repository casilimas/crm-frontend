import React, { useState, useEffect, useRef } from 'react';
import { MailCheck } from 'lucide-react';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

const CambiarCorreo = ({ activeForm, onToggle }) => {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState({});
  const [selectedUser, setSelectedUser] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const formRef = useRef(null);

  const isActive = activeForm === 'cambiarCorreo';

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await api.get('/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const agrupados = {};
        for (const [departamento, lista] of Object.entries(res.data)) {
          if (lista.length > 0) agrupados[departamento] = lista;
        }
        setUsuarios(agrupados);
      } catch (error) {
        console.error('Error al obtener usuarios', error);
      }
    };

    if (isActive) fetchUsuarios();
  }, [isActive, token]);

  // 🔒 Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        onToggle(null);
      }
    };

    if (isActive) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive, onToggle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/users/${selectedUser}/email`,
        { newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedUser('');
      setNewEmail('');
      onToggle(null);

      setMessage('✅ Correo actualizado correctamente');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        setMessage('');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al actualizar el correo');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        setMessage('');
      }, 2000);
    }
  };

  return (
    <div className="mb-6 relative">
      {/* 🔘 Botón */}
      <button
        onClick={() => onToggle(isActive ? null : 'cambiarCorreo')}
        title="Cambiar correo de usuario"
        className="flex flex-col items-center bg-red-500 text-black p-0.5 w-16 rounded sm:p-2 sm:w-16 hover:bg-gray-400 transition mt-5"
      >
        <div className="relative group">
          <MailCheck size={22} className="transition-transform group-hover:scale-110" />
        </div>
        <span className="text-[8px] mt-1">Cambio correo</span>
      </button>

      {/* 📩 Mensaje */}
      {showMessage && (
        <div className="fixed top-5 right-5 bg-yellow-100 border border-yellow-600 text-yellow-800 text-sm rounded px-4 py-2 shadow-md w-[300px] z-50">
          {message}
        </div>
      )}

      {/* 📬 Formulario flotante centrado */}
      {isActive && (
        <div
          ref={formRef}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 text-black rounded shadow-md w-[300px] z-50"
        >
          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Selecciona un usuario</option>
              {Object.entries(usuarios).map(([departamento, lista]) => (
                <optgroup key={departamento} label={departamento}>
                  {lista.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Nuevo correo"
              required
              className="w-full px-3 py-2 border rounded"
            />

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Actualizar correo
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CambiarCorreo;
