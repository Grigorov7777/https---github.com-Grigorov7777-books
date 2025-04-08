import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import AddBook from './components/AddBook';
import BookDetails from './components/BookDetails';
import EditBook from './components/EditBook';  {/* Импортиране на компонента за редактиране */}
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

const App = () => {
  return (
    <Router>
      {/* Цялата страница с фонов цвят и padding */}
      <div className="min-h-screen bg-[url('https://example.com/wood-texture.jpg')] bg-cover bg-center text-gray-900"> {/* Дървесен фон */}
        
        {/* Навигация */}
        <Header />
        
        {/* Основното съдържание */}
        <div className="container mx-auto p-4 bg-white bg-opacity-80 rounded-lg shadow-lg">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/edit-book/:bookId" element={<EditBook />} /> {/* Сменен параметър на пътя */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
