import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import AddBook from './components/AddBook';
import BookDetails from './components/BookDetails'; // Импортираме BookDetails
import Login from './pages/Login'; // Импортираме Login компонента
import Register from './pages/Register'; // Импортираме Register компонента

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/book/:id" element={<BookDetails />} /> {/* Добавяме BookDetails */}
        <Route path="/login" element={<Login />} /> {/* Добавяме Login */}
        <Route path="/register" element={<Register />} /> {/* Добавяме Register */}
      </Routes>
    </Router>
  );
};

export default App;

