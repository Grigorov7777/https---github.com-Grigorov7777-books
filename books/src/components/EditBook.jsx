import { css } from '@emotion/react';
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Стилове
const containerStyle = css`
  padding: 24px;
  max-width: 960px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const formStyle = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const inputStyle = css`
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #8B4513;
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const textareaStyle = css`
  ${inputStyle};
  resize: vertical;
  min-height: 120px;
`;

const buttonStyle = css`
  background-color: #8B4513;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.2s ease-in-out;

  &:hover {
    background-color: #A0522D;
    transform: scale(1.05);
  }
`;

const EditBook = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookId) {
      const fetchBook = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/books/${bookId}`);
          if (!response.ok) throw new Error("Не успяхме да заредим данните за книгата.");
          const data = await response.json();
          setBook(data);
        } catch (error) {
          console.error(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchBook();
    }
  }, [bookId]);

  const handleInputChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      });

      if (!response.ok) throw new Error("Не успяхме да запишем промените в книгата.");

      alert("Книгата беше успешно редактирана!");
      navigate(`/`);
    } catch (error) {
      console.error("Грешка при редактиране на книгата:", error);
      alert("Не успяхме да редактираме книгата.");
    }
  };

  if (loading) return <p>Зареждаме данните за книгата...</p>;
  if (!book) return <p>Няма такава книга.</p>;

  return (
    <div css={containerStyle}>
      <h1>Редактиране на книга</h1>
      <form onSubmit={handleSubmit} css={formStyle}>
        <input
          type="text"
          name="title"
          value={book.title}
          onChange={handleInputChange}
          placeholder="Заглавие"
          css={inputStyle}
          required
        />
        <input
          type="text"
          name="author"
          value={book.author}
          onChange={handleInputChange}
          placeholder="Автор"
          css={inputStyle}
          required
        />
        <textarea
          name="description"
          value={book.description}
          onChange={handleInputChange}
          placeholder="Описание"
          css={textareaStyle}
          required
        />
        <button type="submit" css={buttonStyle}>
          Запази промените
        </button>
      </form>
    </div>
  );
};

export default EditBook;
