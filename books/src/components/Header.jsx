import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <h1>Добре дошли в Форум за книги</h1>
      <nav>
        <ul>
          <li><Link to="/">Начало</Link></li>
          <li><Link to="/add-book">Добави книга</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
