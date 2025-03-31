import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-[url('https://example.com/wood-texture.jpg')] bg-cover bg-center text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Заглавие */}
        <h1 className="text-xl font-bold text-shadow-lg">Форум за книги</h1>

        {/* Навигация */}
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-gray-200 transition duration-300">Начало</Link>
            </li>
            <li>
              <Link to="/add-book" className="hover:text-gray-200 transition duration-300">Добави книга</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-gray-200 transition duration-300">Вход</Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-gray-200 transition duration-300">Регистрация</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
