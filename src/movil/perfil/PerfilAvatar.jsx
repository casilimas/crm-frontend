import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { useActualizacion } from "../../actualizacion/actualizacionAutomatica";

const ProfileAvatar = () => {
  const { token, user, setUser } = useAuth();
  const { toggleRefrescar } = useActualizacion();
  const [currentProfile, setCurrentProfile] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allUsers = Object.values(res.data).flat();
        const matchedUser = allUsers.find((u) => u._id === user.id);
        if (matchedUser) setCurrentProfile(matchedUser);
      } catch (err) {
        console.error("❌ Error al obtener datos del usuario:", err);
      }
    };

    if (user?.id) fetchUser();
  }, [token, user]);

  const handleAvatarClick = () => setShowMenu(!showMenu);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.put("/users/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser((prev) => ({ ...prev, avatar: res.data.avatar }));
      setCurrentProfile((prev) => ({ ...prev, avatar: res.data.avatar }));
      setShowMenu(false);
      toggleRefrescar();
    } catch (err) {
      console.error("❌ Error al subir avatar:", err);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const res = await api.delete("/users/avatar", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser((prev) => ({ ...prev, avatar: res.data.avatar }));
      setCurrentProfile((prev) => ({ ...prev, avatar: res.data.avatar }));
      setShowMenu(false);
      toggleRefrescar();
    } catch (err) {
      console.error("❌ Error al eliminar avatar:", err);
    }
  };

  if (!currentProfile) return <p className="text-center">Cargando perfil...</p>;

  return (
    <div className="block md:hidden relative mt-2 bg-gray-50 rounded-lg shadow-md p-2 w-[130px] h-[170px] mx-auto">
      {/* Avatar */}
      <img
        src={currentProfile.avatar || "/default-avatar.png"}
        alt="Avatar"
        className="w-[70px] h-[70px] rounded-full border border-gray-300 shadow cursor-pointer mx-auto"
        onClick={handleAvatarClick}
      />

      {/* Datos */}
      <div className="mt-2 text-[11px] text-gray-700 text-left">
        <p className="font-bold truncate" title={currentProfile.name}>
          {currentProfile.name}
        </p>
        <p><strong>Rol:</strong> {currentProfile.role}</p>
        <p><strong>Status:</strong> {currentProfile.status}</p>
      </div>

      {/* Menú de opciones */}
      {showMenu && (
        <div className="absolute top-[80px] left-[5px] flex flex-col items-center justify-center bg-black shadow-md rounded z-50">
          <button
            className="block w-full text-left px-2 py-1 text-white hover:bg-blue-950"
            onClick={() => fileInputRef.current.click()}
          >
            Cambiar foto
          </button>
          <button
            className="block w-full text-left px-2 py-1 text-white hover:bg-blue-950"
            onClick={handleRemoveAvatar}
          >
            Eliminar foto
          </button>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ProfileAvatar;
