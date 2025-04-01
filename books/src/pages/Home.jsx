/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState } from "react";
import { registerUser, loginUser, logoutUser, addReview } from "../firebase";
import { useNavigate } from "react-router-dom";

// Стилове
const containerStyle = css`
  padding: 24px;
  max-width: 960px;
  margin: 0 auto;
`;

const headerStyle = css`
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
`;

const formStyle = css`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const inputStyle = css`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 66%;
`;

const buttonStyle = css`
  background-color: #8B4513;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
  font-family: 'Times New Roman', serif;

  &:hover {
    background-color: #A0522D;
    transform: scale(1.05);
  }
`;

const bookListStyle = css`
  margin-top: 24px;
  list-style-type: none;
  padding: 0;
`;

const bookItemStyle = css`
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const textareaStyle = css`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 8px;
`;

const loginRegisterStyle = css`
  margin-top: 24px;
`;

const Home = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(true); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [reviewText, setReviewText] = useState(""); 
  const [books, setBooks] = useState([]);  
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const url = `http://localhost:5000/api/books?search=${searchQuery}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Грешка при зареждане на книгите");
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks();  
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      alert("Изходът е успешен!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAddReview = async (bookId, reviewText) => {
    if (!reviewText.trim()) {
      alert("Моля, въведете ревю!");
      return;
    }

    try {
      await addReview(bookId, reviewText);
      alert("Мнението е успешно добавено!");
      setReviewText("");  // Изчистване на полето за текст след добавяне на ревю
    } catch (error) {
      console.error("Грешка при добавяне на мнението:", error);
      alert("Не успяхме да добавим мнението.");
    }
  };

  return (
    <div css={containerStyle}>
      <h1 css={headerStyle}>Добре дошли в сайта за книги!</h1>

      <div css={loginRegisterStyle}>
        <h2>Търсене на книги</h2>
        <form onSubmit={handleSearch} css={formStyle}>
          <input
            type="text"
            placeholder="Търсете книги..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            css={inputStyle}
          />
          <button type="submit" css={buttonStyle}>
            Търсене
          </button>
        </form>

        {loading && <p>Зареждаме книгите...</p>}

        {books.length === 0 ? (
          <p>Няма налични книги.</p>
        ) : (
          <ul css={bookListStyle}>
            {books.map((book) => (
              <li key={book.id} css={bookItemStyle}>
                <h3>{book.title}</h3>
                <p><strong>Автор:</strong> {book.author}</p>
                {book.description && <p><strong>Описание:</strong> {book.description}</p>}
                {book.price && <p><strong>Цена:</strong> {book.price} лв.</p>}

                <div>
                  <h4>Добавете мнение:</h4>
                  <textarea
                    placeholder="Вашето мнение..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    css={textareaStyle}
                  />
                  <button 
                    onClick={() => handleAddReview(book.id, reviewText)} 
                    css={buttonStyle}
                  >
                    Добави мнение
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={handleLogout} css={buttonStyle}>Изход</button>
    </div>
  );
};

export default Home;
