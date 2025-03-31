/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import axios from "axios";
import { css } from '@emotion/react'; // Импортиране на css функцията

const AddBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !author || !image) {
      alert("Моля, попълнете всички задължителни полета.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:5000/api/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Book added:", response.data);
      alert("Книгата беше успешно добавена!");
    } catch (error) {
      console.error("Error adding book:", error.response ? error.response.data : error.message);
      alert("Грешка при добавяне на книгата. Моля, опитайте отново.");
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div css={styles.container}>
      <h2>Добави нова книга</h2>
      <form onSubmit={handleSubmit} css={styles.form}>
        <div css={styles.inputGroup}>
          <label css={styles.label}>Заглавие на книгата:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            css={styles.input}
          />
        </div>
        <div css={styles.inputGroup}>
          <label css={styles.label}>Автор:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            css={styles.input}
          />
        </div>
        <div css={styles.inputGroup}>
          <label css={styles.label}>Снимка:</label>
          <input
            type="file"
            onChange={handleImageChange}
            required
            css={styles.input}
          />
        </div>
        <div css={styles.inputGroup}>
          <label css={styles.label}>Описание:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            css={styles.textarea}
          ></textarea>
        </div>
        <button type="submit" css={styles.button}>Добави книга</button>
      </form>
    </div>
  );
};

// Стилове с Emotion
const styles = {
  container: css`
    padding: 20px;
    max-width: 500px;
    margin: 0 auto;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  `,
  form: css`
    display: flex;
    flex-direction: column;
  `,
  inputGroup: css`
    margin-bottom: 15px;
  `,
  label: css`
    font-weight: bold;
    margin-bottom: 5px;
  `,
  input: css`
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
  `,
  textarea: css`
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical;
  `,
  button: css`
    padding: 10px;
    background-color: #007bff;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: #0056b3;
    }
  `,
};

export default AddBook;



