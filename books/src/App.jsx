import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import AddBook from './components/AddBook';
import BookDetails from './components/BookDetails';
import EditBook from './components/EditBook'; // Импортиране на компонента за редактиране на книги
import Login from './pages/Login';
import Register from './pages/Register';
import Bookstores from './pages/Bookstores'; // Импортиране на новата страница за книжарници
import Libraries from './pages/Libraries'; // Импортиране на новата страница за библиотеки
import BookClubs from './pages/BookClubs'; // Импортиране на новата страница за читателски клубове
import Profile from './pages/Profile'; // Импортиране на новия компонент за профил
import './App.css'; // Импорт на CSS стилове

const App = () => {
  return (
    <Router>
      {/* Цялата страница с фонов цвят и padding */}
      <div className="min-h-screen bg-[url('https://example.com/wood-texture.jpg')] bg-cover bg-center text-gray-900">
        
        {/* Навигация */}
        <Header />
        
        {/* Основното съдържание */}
        <div className="container mx-auto p-4 bg-white bg-opacity-80 rounded-lg shadow-lg">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/edit-book/:bookId" element={<EditBook />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/bookstores" element={<Bookstores />} /> {/* Нов Route за книжарници */}
            <Route path="/libraries" element={<Libraries />} /> {/* Нов Route за библиотеки */}
            <Route path="/bookclubs" element={<BookClubs />} /> {/* Нов Route за читателски клубове */}
            <Route path="/profile" element={<Profile />} /> {/* Нов Route за профил */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
