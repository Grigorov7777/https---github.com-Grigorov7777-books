import React, { useState } from "react";
import { registerUser, loginUser, logoutUser, addReview } from "../firebase";  // Импортиране на функцията за добавяне на мнение от firebase.js
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(true); // Показваме формата за регистрация или вход
  const [searchQuery, setSearchQuery] = useState("");  // Състояние за търсене
  const [reviewText, setReviewText] = useState("");  // Състояние за текст на мнение
  const [books, setBooks] = useState([]);  // Състояние за книги
  const [loading, setLoading] = useState(false);

  // Функция за търсене на книги
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const url = `http://localhost:5000/api/books?search=${searchQuery}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Грешка при зареждане на книгите');
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Обработчик за търсене
  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks();  // Извикваме API-то за търсене на книги
  };

  // Обработчик за регистрация
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(email, password);
      alert("Регистрацията е успешна!");
      navigate("/"); // Пренасочваме към началната страница след регистрация
    } catch (error) {
      alert(error.message);
    }
  };

  // Обработчик за вход
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      alert("Входът е успешен!");
      navigate("/"); // Пренасочваме към началната страница след вход
    } catch (error) {
      alert(error.message);
    }
  };

  // Обработчик за изход
  const handleLogout = async () => {
    try {
      await logoutUser();
      alert("Изходът е успешен!");
    } catch (error) {
      alert(error.message);
    }
  };

  // Функция за добавяне на мнение към книга
  const handleAddReview = async (bookId, reviewText) => {
    try {
      await addReview(bookId, reviewText); // Добавяме мнението във Firestore
      alert("Мнението е добавено!");
      setReviewText(""); // Изчистваме полето за мнение след добавяне
    } catch (error) {
      alert("Грешка при добавяне на мнение: " + error.message);
    }
  };

  return (
    <div>
      <h1>Добре дошли в сайта за книги!</h1>

      {/* Формата за търсене на книги */}
      <div>
        <h2>Търсене на книги</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Търсете книги..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // използваме searchQuery само за търсене
          />
          <button type="submit">Търсене</button>
        </form>

        {loading && <p>Зареждаме книгите...</p>}

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

                {/* Поле за добавяне на мнение */}
                <div>
                  <h4>Добавете мнение:</h4>
                  <textarea
                    placeholder="Вашето мнение..."
                    value={reviewText} // използваме reviewText за мнението
                    onChange={(e) => setReviewText(e.target.value)} // задаваме стойност за reviewText
                  />
                  <button onClick={() => handleAddReview(book.id, reviewText)}>Добави мнение</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Формата за вход или регистрация */}
      {isRegistered ? (
        <div>
          <h2>Вход в акаунт</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Парола"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Влез</button>
          </form>
          <p>
            Нямате акаунт?{" "}
            <span onClick={() => setIsRegistered(false)} style={{ color: "blue", cursor: "pointer" }}>
              Регистрирайте се тук.
            </span>
          </p>
        </div>
      ) : (
        <div>
          <h2>Регистрация</h2>
          <form onSubmit={handleRegister}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Парола"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Регистрирайте се</button>
          </form>
          <p>
            Вече имате акаунт?{" "}
            <span onClick={() => setIsRegistered(true)} style={{ color: "blue", cursor: "pointer" }}>
              Влезте тук.
            </span>
          </p>
        </div>
      )}

      <button onClick={handleLogout}>Изход</button>
    </div>
  );
};

export default Home;
