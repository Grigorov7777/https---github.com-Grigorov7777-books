/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { css } from '@emotion/react';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [review, setReview] = useState("");
  const [selectedBookId, setSelectedBookId] = useState(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/books';
      if (searchQuery) {
        url += `?search=${searchQuery}`;
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

  const handleSearchClick = () => {
    fetchBooks();
  };

  const handleReviewSubmit = async (bookId) => {
    if (review.trim()) {
      try {
        const bookRef = doc(db, "books", bookId);
        const docSnapshot = await getDoc(bookRef);

        if (docSnapshot.exists()) {
          const currentReviews = docSnapshot.data().reviews || [];
          const updatedReviews = [...currentReviews, { text: review, timestamp: new Date() }];
          await setDoc(bookRef, { reviews: updatedReviews }, { merge: true });
          setReview("");
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
    <div css={css`padding: 24px;`}>
      <h2 css={css`font-size: 24px; font-weight: bold; margin-bottom: 16px;`}>Списък с книги</h2>

      <div css={css`margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;`}>
        <input
          type="text"
          placeholder="Търсете по заглавие или автор..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          css={css`padding: 8px; border: 1px solid #D1D5DB; border-radius: 4px; width: 50%;`}
        />
        <button
          onClick={handleSearchClick}
          css={css`margin-left: 16px; background-color: #3B82F6; color: white; padding: 8px 16px; border-radius: 4px; &:hover {background-color: #2563EB;}`}
        >
          Търсене
        </button>
      </div>

      {books.length === 0 ? (
        <p>Няма налични книги.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id} css={css`background-color: white; padding: 16px; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px;`}>
              <h3 css={css`font-size: 20px; font-weight: 600;`}>{book.title}</h3>
              <p><strong>Автор:</strong> {book.author}</p>
              {book.description && <p><strong>Описание:</strong> {book.description}</p>}
              {book.price && <p><strong>Цена:</strong> {book.price} лв.</p>}

              <div css={css`margin-top: 16px;`}>
                <h4 css={css`font-weight: 500;`}>Напишете мнение</h4>
                <textarea
                  value={selectedBookId === book.id ? review : ""}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Напишете вашето мнение..."
                  rows="4"
                  css={css`width: 100%; padding: 8px; border: 1px solid #D1D5DB; border-radius: 4px; margin-top: 8px;`}
                />
                <button
                  onClick={() => {
                    setSelectedBookId(book.id);
                    handleReviewSubmit(book.id);
                  }}
                  css={css`margin-top: 8px; background-color: #10B981; color: white; padding: 8px 16px; border-radius: 4px; &:hover {background-color: #059669;}`}
                >
                  Добавете мнение
                </button>
              </div>

              <div css={css`margin-top: 16px;`}>
                <h4 css={css`font-weight: 500;`}>Мнения:</h4>
                {book.reviews && book.reviews.length > 0 ? (
                  <ul>
                    {book.reviews.map((review, index) => (
                      <li key={index} css={css`margin-top: 8px; padding: 8px; background-color: #F3F4F6; border-radius: 4px;`}>
                        {review.text}
                      </li>
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
