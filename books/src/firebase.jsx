/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore"; 
import { getAnalytics } from "firebase/analytics";

// Твоят конфигурационен обект от Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyA4nrkUrVWEnREjXYaMX41d4Q3e6XGqB-k",
  authDomain: "books-e154d.firebaseapp.com",
  projectId: "books-e154d",
  storageBucket: "books-e154d.firebasestorage.app",
  messagingSenderId: "322664561254",
  appId: "1:322664561254:web:cd8d5d8f2ef86d446acba7",
  measurementId: "G-WE99H72HY6"
};

// Инициализиране на Firebase
const app = initializeApp(firebaseConfig);

// Инициализиране на Firebase Auth
const auth = getAuth(app);

// Инициализиране на Firebase Firestore
const db = getFirestore(app);

// Инициализиране на Firebase Analytics (по избор)
const analytics = getAnalytics(app);

// Стилове с Emotion
const containerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f8f8f8;
`;

const titleStyle = css`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1.5rem;
`;

const formStyle = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const inputStyle = css`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const buttonStyle = css`
  background-color: #007bff;
  color: white;
  padding: 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const errorStyle = css`
  color: red;
  font-size: 0.9rem;
  margin-top: 1rem;
`;

export const registerUser = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    console.log("Потребителят беше успешно регистриран!");
  } catch (error) {
    console.error("Грешка при регистрацията:", error.message);
    throw new Error(error.message);
  }
};

export const loginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("Потребителят успешно влезе!");
  } catch (error) {
    console.error("Грешка при входа:", error.message);
    throw new Error(error.message);
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("Потребителят беше успешно излязъл!");
  } catch (error) {
    console.error("Грешка при изхода:", error.message);
    throw new Error(error.message);
  }
};

export const addReview = async (bookId, reviewText) => {
  try {
    const docRef = await addDoc(collection(db, "reviews"), {
      bookId,
      reviewText,
      timestamp: new Date(),
    });
    console.log("Мнението е добавено успешно!", docRef.id);
  } catch (error) {
    console.error("Грешка при добавянето на мнение:", error.message);
    throw new Error(error.message);
  }
};

export { auth, db }; 

