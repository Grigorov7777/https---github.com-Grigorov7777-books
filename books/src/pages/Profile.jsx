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

const Profile = () => {
  const [user, setUser] = useState(null); // Състояние за съхранение на данни за потребителя
  const [loading, setLoading] = useState(true); // Състояние за проверка на зареждането
  const [newEmail, setNewEmail] = useState(''); // Състояние за новия имейл
  const [newPassword, setNewPassword] = useState(''); // Състояние за новата парола
  const [message, setMessage] = useState(null); // Състояние за съобщения за грешки/успех
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
      // Вземаме текущия потребител от Firebase Authentication
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

  // Функция за изход от профила
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login'); // Пренасочва към логин след изход
    } catch (error) {
      setMessage({ text: 'Грешка при излизане от профила: ' + error.message, type: 'error' });
    }
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

      <div>
        <button onClick={handleLogout} css={buttonStyle}>Изход</button>
      </div>
    </div>
  );
};

export default Profile;
