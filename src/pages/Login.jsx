import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // 👁️ Importar íconos

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ Estado para mostrar/ocultar contraseña

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      login({ token, user });

      if (user.role === "admin") navigate("/admin");
      else if (user.role === "jefe") navigate("/boss");
      else if (user.role === "trabajador") navigate("/worker");

      setMessage(`Bienvenido ${user.name} (${user.role})`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Iniciar Sesión</h2>

        {/* 📧 Email */}
        <input
          type="email"
          placeholder="Correo"
          className="w-full mb-2 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* 🔐 Contraseña con icono */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            className="w-full p-2 border rounded pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* ✅ Botón entrar */}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Entrar
        </button>

        {/* ⚠️ Mensaje de error */}
        {message && <p className="mt-4 text-sm text-center text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
