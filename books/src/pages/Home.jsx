/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";  // Импортиране на Link за навигация
import {
  registerUser,
  loginUser,
  logoutUser,
  addReview,
  getReviews,
  updateReview,
  deleteReview,
  auth
} from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Profile from './Profile';  // Импортиране на компонента за профил

// Стилове
const containerStyle = css`padding: 24px; max-width: 960px; margin: 0 auto;`;
const headerStyle = css`font-size: 3rem; font-weight: bold; text-align: center; margin-bottom: 24px;`;
const formStyle = css`display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;`;
const inputStyle = css`padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 66%;`;
const buttonStyle = css`
  background-color: #8B4513; color: white; padding: 12px 20px; border: none;
  border-radius: 4px; cursor: pointer; font-weight: bold; text-transform: uppercase;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3); transition: all 0.3s ease-in-out;
  font-family: 'Times New Roman', serif;
  text-align: center;
  &:hover { background-color: #A0522D; transform: scale(1.05); }
`;
const bookListStyle = css`margin-top: 24px; list-style-type: none; padding: 0;`;
const bookItemStyle = css`padding: 16px; border: 1px solid #ccc; border-radius: 8px; margin-bottom: 16px;`;
const textareaStyle = css`width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-top: 8px;`;

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [reviewInputs, setReviewInputs] = useState({});
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/books?search=${searchQuery}`);
      const data = await res.json();
      setBooks(data);

      const reviewMap = {};
      for (const book of data) {
        const bookReviews = await getReviews(book.id);
        reviewMap[book.id] = bookReviews;
      }
      setReviews(reviewMap);
    } catch (error) {
      console.error("Грешка при зареждане:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const handleAddReview = async (bookId) => {
    const text = reviewInputs[bookId]?.trim();
    if (!text) return alert("Моля, въведете мнение.");
    try {
      await addReview(bookId, text);
      setReviewInputs(prev => ({ ...prev, [bookId]: "" }));
      const updatedReviews = await getReviews(bookId);
      setReviews(prev => ({ ...prev, [bookId]: updatedReviews }));
    } catch (err) {
      alert("Грешка при добавяне на мнение.");
    }
  };

  const handleEditReview = async (bookId, reviewId, currentText) => {
    const newText = prompt("Редактирай мнението:", currentText);
    if (newText !== null && newText.trim()) {
      await updateReview(bookId, reviewId, newText.trim());
      const updated = await getReviews(bookId);
      setReviews(prev => ({ ...prev, [bookId]: updated }));
    }
  };

  const handleDeleteReview = async (bookId, reviewId) => {
    if (window.confirm("Сигурен ли си, че искаш да изтриеш мнението?")) {
      await deleteReview(bookId, reviewId);
      const updated = await getReviews(bookId);
      setReviews(prev => ({ ...prev, [bookId]: updated }));
    }
  };

  const handleEditBook = async (book) => {
    const newTitle = prompt("Ново заглавие:", book.title);
    const newAuthor = prompt("Нов автор:", book.author);

    if (newTitle && newAuthor) {
      try {
        await fetch(`http://localhost:5000/api/books/${book.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle, author: newAuthor }),
        });
        fetchBooks();
      } catch (error) {
        alert("Грешка при редактиране на книга.");
        console.error("Грешка при PUT заявка:", error);
      }
    }
  };

  return (
    <div css={containerStyle}>
      <h1 css={headerStyle}>Добре дошли в сайта за книги!</h1>

      <form onSubmit={handleSearch} css={formStyle}>
        <input
          type="text"
          placeholder="Търсете книги..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          css={inputStyle}
        />
        <button type="submit" css={buttonStyle}>Търсене</button>
        <Link to="/bookstores" css={buttonStyle}>Книжарници</Link>
        <Link to="/libraries" css={buttonStyle}>Библиотеки</Link>
        <Link to="/bookclubs" css={buttonStyle}>Читателски клубове</Link>
        {/* Добавяме бутон за профил */}
        {isLoggedIn && (
          <Link to="/profile" css={buttonStyle}>Профил</Link>
        )}
      </form>

      {loading ? <p>Зареждане...</p> : books.length === 0 ? (
        <p>Няма книги.</p>
      ) : (
        <ul css={bookListStyle}>
          {books.map((book) => (
            <li key={book.id} css={bookItemStyle}>
              <h3>{book.title}</h3>
              <p><strong>Автор:</strong> {book.author}</p>

              {isLoggedIn && (
                <button onClick={() => handleEditBook(book)} css={buttonStyle}>
                  Редактирай книга
                </button>
              )}

              <h4>Мнения:</h4>
              <ul>
                {(reviews[book.id] || []).map((rev) => (
                  <li key={rev.id}>
                    <p><strong>{rev.userEmail}</strong>: {rev.text}</p>
                    {currentUser?.uid === rev.userId && (
                      <>
                        <button onClick={() => handleEditReview(book.id, rev.id, rev.text)} css={buttonStyle}>
                          Редактирай
                        </button>
                        <button onClick={() => handleDeleteReview(book.id, rev.id)} css={buttonStyle}>
                          Изтрий
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              {isLoggedIn && (
                <>
                  <textarea
                    value={reviewInputs[book.id] || ""}
                    onChange={(e) =>
                      setReviewInputs((prev) => ({ ...prev, [book.id]: e.target.value }))}
                    placeholder="Добави мнение..."
                    css={textareaStyle}
                  />
                  <button onClick={() => handleAddReview(book.id)} css={buttonStyle}>
                    Добави мнение
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {isLoggedIn && (
        <button onClick={logoutUser} css={buttonStyle}>Изход</button>
      )}
    </div>
  );
};

export default Home;
