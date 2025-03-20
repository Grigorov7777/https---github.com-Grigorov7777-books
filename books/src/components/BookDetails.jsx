import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BookDetails = () => {
  const { id } = useParams(); // Извличаме id на книгата от URL-а
  const [book, setBook] = useState(null); // Състояние за съхранение на данни за книгата
  const [loading, setLoading] = useState(true); // Състояние за зареждане

  // Извличане на данни за книгата при зареждане на компонента
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `https://your-api-url.com/books/${id}` // Замени с твоя URL на API-то
        );
        setBook(response.data);
        setLoading(false); // Книгата е заредена
      } catch (error) {
        console.error("Error fetching book details:", error);
        setLoading(false); // Книгата не може да бъде заредена
      }
    };

    fetchBookDetails();
  }, [id]); // Повторно извикване при промяна на id

  if (loading) {
    return <p>Зареждаме детайлите за книгата...</p>;
  }

  if (!book) {
    return <p>Не успяхме да намерим тази книга.</p>;
  }

  return (
    <div>
      <h2>{book.title}</h2>
      <p><strong>Автор:</strong> {book.author}</p>
      <p><strong>Описание:</strong> {book.description}</p>
    </div>
  );
};

export default BookDetails;
