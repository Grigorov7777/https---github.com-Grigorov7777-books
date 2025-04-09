/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase конфигурация
const firebaseConfig = {
  apiKey: "AIzaSyA4nrkUrVWEnREjXYaMX41d4Q3e6XGqB-k",
  authDomain: "books-e154d.firebaseapp.com",
  projectId: "books-e154d",
  storageBucket: "books-e154d.firebasestorage.app",
  messagingSenderId: "322664561254",
  appId: "1:322664561254:web:cd8d5d8f2ef86d446acba7",
  measurementId: "G-WE99H72HY6"
};

// Инициализация
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// 🔐 Регистрация
export const registerUser = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    console.log("Потребителят беше успешно регистриран!");
  } catch (error) {
    console.error("Грешка при регистрацията:", error.message);
    throw new Error(error.message);
  }
};

// 🔐 Вход
export const loginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("Потребителят успешно влезе!");
  } catch (error) {
    console.error("Грешка при входа:", error.message);
    throw new Error(error.message);
  }
};

// 🔐 Изход
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("Потребителят излезе успешно!");
  } catch (error) {
    console.error("Грешка при изхода:", error.message);
    throw new Error(error.message);
  }
};

// ✍️ Добавяне на мнение (като под-колекция на книга)
export const addReview = async (bookId, reviewText) => {
  try {
    const reviewRef = collection(db, `books/${bookId}/reviews`);
    await addDoc(reviewRef, {
      text: reviewText,
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email,
      timestamp: new Date()
    });
    console.log("Мнението е добавено успешно!");
  } catch (error) {
    console.error("Грешка при добавянето на мнение:", error.message);
    throw new Error(error.message);
  }
};

// 📥 Зареждане на мнения за книга
export const getReviews = async (bookId) => {
  try {
    const reviewsSnapshot = await getDocs(collection(db, `books/${bookId}/reviews`));
    return reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Грешка при взимането на мнения:", error.message);
    return [];
  }
};

// 📝 Редактиране на мнение
export const updateReview = async (bookId, reviewId, newText) => {
  try {
    const reviewRef = doc(db, `books/${bookId}/reviews/${reviewId}`);
    await updateDoc(reviewRef, {
      text: newText,
      timestamp: new Date()
    });
    console.log("Мнението е редактирано успешно!");
  } catch (error) {
    console.error("Грешка при редактиране на мнение:", error.message);
    throw new Error(error.message);
  }
};

// ❌ Изтриване на мнение
export const deleteReview = async (bookId, reviewId) => {
  try {
    const reviewRef = doc(db, `books/${bookId}/reviews/${reviewId}`);
    await deleteDoc(reviewRef);
    console.log("Мнението е изтрито успешно!");
  } catch (error) {
    console.error("Грешка при изтриване на мнение:", error.message);
    throw new Error(error.message);
  }
};

// Експорт
export { auth, db };
