import React, { useState } from "react";
import axios from "axios";

const AddBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null); // Променяме на null, тъй като ще приемаме файл
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка дали всички задължителни полета са попълнени
    if (!title || !author || !image) {
      alert("Моля, попълнете всички задължителни полета.");
      return;
    }

    // Създаване на FormData обект
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("image", image); // Добавяне на изображение

    try {
      // Изпращане на POST заявка с FormData
      const response = await axios.post("http://localhost:5000/api/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Заглавие за multipart форма
        },
      });

      console.log("Book added:", response.data);
      // Можеш да добавиш тук логика за това какво да се случи след успешното добавяне
      alert("Книгата беше успешно добавена!");
    } catch (error) {
      console.error("Error adding book:", error.response ? error.response.data : error.message);
      alert("Грешка при добавяне на книгата. Моля, опитайте отново.");
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Записваме файла
  };

  return (
    <div>
      <h2>Добави нова книга</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Заглавие на книгата:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Автор:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Снимка:</label>
          <input
            type="file"
            onChange={handleImageChange}
            required
          />
        </div>
        <div>
          <label>Описание:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <button type="submit">Добави книга</button>
      </form>
    </div>
  );
};

export default AddBook;


