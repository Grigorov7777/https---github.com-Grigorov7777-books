import React, { useState, useEffect } from 'react';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Стойност за търсене
  const [loading, setLoading] = useState(false); // Променяме на false първоначално
  const [error, setError] = useState(null);

  // Функция за търсене на книги
  const fetchBooks = async () => {
    setLoading(true); // Показваме индикатор за зареждане
    try {
      let url = 'http://localhost:5000/api/books'; // Началният URL за книги
      if (searchQuery) {
        url += `?search=${searchQuery}`; // Ако има търсене, добавяме параметър към URL
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Грешка при зареждане на книгите');
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Извикваме функцията за търсене при натискане на бутона
  const handleSearchClick = () => {
    fetchBooks(); // Стартираме търсенето
  };

  if (loading) return <p>Зареждане на книгите...</p>;
  if (error) return <p>Грешка: {error}</p>;

  return (
    <div>
      <h2>Списък с книги</h2>
      {/* Поле за търсене */}
      <input 
        type="text" 
        placeholder="Търсете по заглавие или автор..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} 
      />
      {/* Бутон за търсене */}
      <button onClick={handleSearchClick}>Търсене</button>

      {books.length === 0 ? (
        <p>Няма налични книги.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <h3>{book.title}</h3>
              <p><strong>Автор:</strong> {book.author}</p>
              {book.description && <p><strong>Описание:</strong> {book.description}</p>}
              {book.price && <p><strong>Цена:</strong> {book.price} лв.</p>}
              {/* Проверяваме дали има изображение и ако има, го показваме */}
              {book.image && <img src={`http://localhost:5000${book.image}`} alt={book.title} width="100" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookList;
