/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Импортиране на Firebase
import { onAuthStateChanged } from 'firebase/auth'; // За проследяване на състоянието на автентикацията
import { useNavigate } from 'react-router-dom'; // За пренасочване при неуспешна автентикация
import { logoutUser } from '../firebase'; // Импортиране на логика за излизане от профил

// Стилове
const containerStyle = css`padding: 24px; max-width: 960px; margin: 0 auto;`;
const headerStyle = css`font-size: 2rem; font-weight: bold; text-align: center; margin-bottom: 24px;`;
const formStyle = css`display: flex; flex-direction: column; gap: 16px;`;
const inputStyle = css`padding: 8px; border: 1px solid #ccc; border-radius: 4px;`;
const buttonStyle = css`
  background-color: #8B4513; color: white; padding: 12px 20px; border: none;
  border-radius: 4px; cursor: pointer; font-weight: bold; text-transform: uppercase;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3); transition: all 0.3s ease-in-out;
  font-family: 'Times New Roman', serif;
  text-align: center;
  &:hover { background-color: #A0522D; transform: scale(1.05); }
`;

// Стилове за съобщения
const messageStyle = css`
  padding: 10px; margin: 10px 0; border-radius: 4px; 
  font-weight: bold; text-align: center;
`;
const successMessageStyle = css`
  background-color: #4CAF50; color: white;
`;
const errorMessageStyle = css`
  background-color: #f44336; color: white;
`;

// Стилове за мненията и книгите
const reviewsStyle = css`margin-top: 20px; padding: 20px; background-color: #f4f4f4; border-radius: 8px;`;
const bookItemStyle = css`padding: 10px; margin-bottom: 8px; background-color: #fff; border-radius: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);`;

const Profile = () => {
  const [user, setUser] = useState(null); // Състояние за съхранение на данни за потребителя
  const [loading, setLoading] = useState(true); // Състояние за проверка на зареждането
  const [newEmail, setNewEmail] = useState(''); // Състояние за новия имейл
  const [newPassword, setNewPassword] = useState(''); // Състояние за новата парола
  const [message, setMessage] = useState(null); // Състояние за съобщения за грешки/успех
  const [books, setBooks] = useState([]); // Състояние за книгите на потребителя
  const [newBook, setNewBook] = useState(''); // Състояние за нова книга
  const [newReview, setNewReview] = useState(''); // Състояние за ново мнение
  const [editIndex, setEditIndex] = useState(null); // Индекс на мнението, което се редактира
  const [editBook, setEditBook] = useState(''); // Редактиране на книга
  const [editReview, setEditReview] = useState(''); // Редактиране на мнение
  const navigate = useNavigate();

  // Функция за извличане на данни за потребителя от Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login'); // Пренасочва към login, ако няма влязъл потребител
      } else {
        setUser(currentUser);
        setNewEmail(currentUser.email || ''); // Задава имейла от Firebase
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Извличаме мненията от localStorage
  useEffect(() => {
    const storedReviews = JSON.parse(localStorage.getItem('reviews'));
    if (storedReviews) {
      setBooks(storedReviews);
    }
  }, []);

  // Функция за обновяване на профила
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Нулираме предишното съобщение

    // Валидация на новия имейл
    if (newEmail && !/\S+@\S+\.\S+/.test(newEmail)) {
      setMessage({ text: 'Моля, въведете валиден имейл!', type: 'error' });
      return;
    }

    // Валидация на новата парола
    if (newPassword && newPassword.length < 6) {
      setMessage({ text: 'Паролата трябва да е поне 6 символа!', type: 'error' });
      return;
    }

    try {
      const currentUser = auth.currentUser;

      // Ако имейлът е променен, обновяваме имейла
      if (newEmail !== currentUser.email) {
        await currentUser.updateEmail(newEmail);
      }

      // Ако има нова парола, я обновяваме
      if (newPassword) {
        await currentUser.updatePassword(newPassword);
      }

      setMessage({ text: 'Профилът беше обновен успешно!', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Грешка при обновяване на профила: ' + error.message, type: 'error' });
    }
  };

  // Функция за добавяне на ново мнение
  const handleAddReview = (e) => {
    e.preventDefault();
    if (newBook && newReview) {
      const updatedBooks = [...books, { book: newBook, review: newReview }];
      setBooks(updatedBooks);
      setNewBook('');
      setNewReview('');

      // Записваме новите мнения в localStorage
      localStorage.setItem('reviews', JSON.stringify(updatedBooks));
    }
  };

  // Функция за изход от профила
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login'); // Пренасочва към логин след изход
    } catch (error) {
      setMessage({ text: 'Грешка при излизане от профила: ' + error.message, type: 'error' });
    }
  };

  // Функция за редактиране на мнение
  const handleEditReview = (index) => {
    const bookToEdit = books[index];
    setEditIndex(index);
    setEditBook(bookToEdit.book);
    setEditReview(bookToEdit.review);
  };

  // Функция за обновяване на редактираното мнение
  const handleUpdateReview = (e) => {
    e.preventDefault();
    const updatedBooks = [...books];
    updatedBooks[editIndex] = { book: editBook, review: editReview };
    setBooks(updatedBooks);

    // Записваме обновените мнения в localStorage
    localStorage.setItem('reviews', JSON.stringify(updatedBooks));

    // Нулираме състоянието за редактиране
    setEditIndex(null);
    setEditBook('');
    setEditReview('');
  };

  // Функция за изтриване на мнение
  const handleDeleteReview = (index) => {
    const updatedBooks = books.filter((_, i) => i !== index);
    setBooks(updatedBooks);
    localStorage.setItem('reviews', JSON.stringify(updatedBooks));
  };

  // Ако се зареждат данни, показваме индикатор за зареждане
  if (loading) return <p>Зареждам...</p>;

  return (
    <div css={containerStyle}>
      <h1 css={headerStyle}>Профил на потребителя</h1>

      {/* Показваме данни за потребителя */}
      {user && (
        <div>
          <p><strong>Имейл:</strong> {user.email}</p>
          <p><strong>UID:</strong> {user.uid}</p>
        </div>
      )}

      <h2>Редактирайте профила си</h2>

      {/* Показваме съобщения за грешки или успех */}
      {message && (
        <div css={[messageStyle, message.type === 'success' ? successMessageStyle : errorMessageStyle]}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} css={formStyle}>
        <div>
          <label>
            Нов имейл:
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              css={inputStyle}
            />
          </label>
        </div>
        
        <div>
          <label>
            Нова парола (по желание):
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              css={inputStyle}
            />
          </label>
        </div>

        <div>
          <button type="submit" css={buttonStyle}>Запази промените</button>
        </div>
      </form>

      <h2 css={headerStyle}>Мнения и Книги</h2>

      {/* Форма за добавяне на ново мнение */}
      <form onSubmit={handleAddReview} css={formStyle}>
        <div>
          <label>
            Книга:
            <input
              type="text"
              value={newBook}
              onChange={(e) => setNewBook(e.target.value)}
              required
              css={inputStyle}
            />
          </label>
        </div>
        
        <div>
          <label>
            Мнение:
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              required
              css={inputStyle}
            />
          </label>
        </div>

        <div>
          <button type="submit" css={buttonStyle}>Добави мнение</button>
        </div>
      </form>

      {/* Показваме мненията и бутоните за редактиране и изтриване */}
      {books.length > 0 && (
        <div css={reviewsStyle}>
          {books.map((item, index) => (
            <div key={index} css={bookItemStyle}>
              <h3>{item.book}</h3>
              <p>{item.review}</p>
              <button onClick={() => handleEditReview(index)} css={buttonStyle}>Редактирай</button>
              <button onClick={() => handleDeleteReview(index)} css={buttonStyle}>Изтрий</button>
            </div>
          ))}
        </div>
      )}

      {/* Форма за редактиране на мнение */}
      {editIndex !== null && (
        <form onSubmit={handleUpdateReview} css={formStyle}>
          <h3>Редактиране на мнение</h3>
          <div>
            <label>
              Книга:
              <input
                type="text"
                value={editBook}
                onChange={(e) => setEditBook(e.target.value)}
                required
                css={inputStyle}
              />
            </label>
          </div>
          
          <div>
            <label>
              Мнение:
              <textarea
                value={editReview}
                onChange={(e) => setEditReview(e.target.value)}
                required
                css={inputStyle}
              />
            </label>
          </div>

          <div>
            <button type="submit" css={buttonStyle}>Обнови мнение</button>
            <button type="button" onClick={() => setEditIndex(null)} css={buttonStyle}>Отмени</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
