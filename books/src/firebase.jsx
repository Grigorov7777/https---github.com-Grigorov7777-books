import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore"; // Импортираме Firestore функции
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

// Функции за регистрация, вход и изход

// Регистрация на потребител
export const registerUser = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    console.log("Потребителят беше успешно регистриран!");
  } catch (error) {
    console.error("Грешка при регистрацията:", error.message);
    throw new Error(error.message);
  }
};

// Вход на потребител
export const loginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("Потребителят успешно влезе!");
  } catch (error) {
    console.error("Грешка при входа:", error.message);
    throw new Error(error.message);
  }
};

// Изход на потребител
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("Потребителят беше успешно излязъл!");
  } catch (error) {
    console.error("Грешка при изхода:", error.message);
    throw new Error(error.message);
  }
};

// Функция за добавяне на мнение към книга в Firestore
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

export { auth, db }; // Може да бъде полезно за използване в други компоненти.
