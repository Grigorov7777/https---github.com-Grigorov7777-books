// src/pages/Login.jsx
import React, { useState } from "react";
import { loginUser } from "../firebase"; // Импортиране на функцията за вход
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Обработчик за вход
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password); // Използваме функцията за вход
      alert("Входът е успешен!");
      navigate("/"); // Пренасочваме към началната страница
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Вход в акаунт</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Парола"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Влез</button>
      </form>
      <p>
        Нямате акаунт?{" "}
        <span
          onClick={() => navigate("/register")}
          style={{ color: "blue", cursor: "pointer" }}
        >
          Регистрирайте се тук.
        </span>
      </p>
    </div>
  );
};

export default Login;
