// src/pages/Register.jsx
import React, { useState } from "react";
import { registerUser } from "../firebase"; // Импортиране на функцията за регистрация
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Обработчик за регистрация
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(email, password); // Използваме функцията за регистрация
      alert("Регистрацията е успешна!");
      navigate("/"); // Пренасочваме към началната страница
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Регистрация</h2>
      <form onSubmit={handleRegister}>
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
        <button type="submit">Регистрирайте се</button>
      </form>
      <p>
        Вече имате акаунт?{" "}
        <span
          onClick={() => navigate("/login")}
          style={{ color: "blue", cursor: "pointer" }}
        >
          Влезте тук.
        </span>
      </p>
    </div>
  );
};

export default Register;
