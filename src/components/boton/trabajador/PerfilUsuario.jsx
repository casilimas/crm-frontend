import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

const PerfilUsuario = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = user?._id || user?.id;

      

      if (!userId) {
        console.warn("⚠️ No hay ID de usuario. No se hace la solicitud.");
        return;
      }

      try {
        const res = await api.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("❌ Error al cargar el perfil:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user, token]);

  if (loading) return <p className="text-sm text-gray-500">Cargando perfil...</p>;
  if (!profile) return <p className="text-sm text-red-500">No se encontró el perfil</p>;

  return (
    <div className="bg-white text-black rounded-lg shadow-md p-4 w-full max-w-md">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={profile.avatar}
          alt="Avatar"
          className="w-20 h-20 rounded-full border-4 border-gray-300"
        />
        <div>
          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-sm text-gray-600">{profile.email}</p>
        </div>
      </div>

      <div className="text-sm space-y-1">
        <p><strong>Rol:</strong> {profile.role}</p>
        <p><strong>Estado:</strong> {profile.status}</p>
        <p><strong>Departamento:</strong> {profile.department}</p>
        <p><strong>Creado:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default PerfilUsuario;
