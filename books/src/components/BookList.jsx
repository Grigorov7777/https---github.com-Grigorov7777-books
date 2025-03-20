// src/components/BookList.jsx

import React, { useState, useEffect } from 'react';

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/books');
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Грешка при зареждане на книгите:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div>
      <h2>Списък с книги</h2>
      {books.length === 0 ? (
        <p>Няма налични книги.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book._id}>
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <p>{book.description}</p>
              <p>Цена: {book.price} лв.</p>
              <img src={book.image} alt={book.title} width="100" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookList;
