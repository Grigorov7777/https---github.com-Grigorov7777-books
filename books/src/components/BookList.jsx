import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Уверете се, че използвате правилния импорт за Firestore
import { doc, setDoc, getDoc } from "firebase/firestore"; 

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Стойност за търсене
  const [loading, setLoading] = useState(false); // Променяме на false първоначално
  const [error, setError] = useState(null);
  const [review, setReview] = useState(""); // Състояние за мнението на потребителя
  const [selectedBookId, setSelectedBookId] = useState(null); // ID на избраната книга за мнение

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

  // Функция за записване на мнение в Firestore
  const handleReviewSubmit = async (bookId) => {
    if (review.trim()) {
      try {
        // Добавяме мнението към конкретната книга в Firestore
        const bookRef = doc(db, "books", bookId); // Вземаме референция за книгата
        const docSnapshot = await getDoc(bookRef);

        if (docSnapshot.exists()) {
          // Ако книгата съществува в Firestore, добавяме мнението
          const currentReviews = docSnapshot.data().reviews || []; // Вземаме текущите мнения (ако има)
          const updatedReviews = [...currentReviews, { text: review, timestamp: new Date() }];
          
          // Записваме актуализираните мнения обратно в Firestore
          await setDoc(bookRef, { reviews: updatedReviews }, { merge: true });
          setReview(""); // Изчистваме полето за мнението
          alert("Мнението е успешно добавено!");
        } else {
          alert("Книгата не съществува.");
        }
      } catch (error) {
        alert("Грешка при запис на мнението: " + error.message);
      }
    } else {
      alert("Моля, въведете мнение.");
    }
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

              {/* Поле за мнение */}
              <div>
                <h4>Напишете мнение</h4>
                <textarea
                  value={selectedBookId === book.id ? review : ""}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Напишете вашето мнение..."
                  rows="4"
                  cols="50"
                />
                <button 
                  onClick={() => {
                    setSelectedBookId(book.id); // Записваме ID-то на избраната книга
                    handleReviewSubmit(book.id); // Записваме мнението
                  }}
                >
                  Добавете мнение
                </button>
              </div>

              {/* Показваме съществуващите мнения */}
              <div>
                <h4>Мнения:</h4>
                {book.reviews && book.reviews.length > 0 ? (
                  <ul>
                    {book.reviews.map((review, index) => (
                      <li key={index}>{review.text}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Няма мнения за тази книга.</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookList;
