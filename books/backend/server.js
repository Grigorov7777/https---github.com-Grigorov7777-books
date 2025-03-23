const express = require('express');
const cors = require('cors');  // Импортираме CORS пакета
const app = express();
const port = 5000;

app.use(cors());  // Позволява всякакви CORS заявки
app.use(express.json());  // Позволява на Express да обработва JSON тела на заявки

let books = [
    { id: 1, title: '1984', author: 'George Orwell' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' }
];

// Рут за получаване на книги
app.get('/api/books', (req, res) => {
    res.json(books);
});

// Рут за добавяне на нова книга
app.post('/api/books', (req, res) => {
    const { title, author } = req.body;
    const newBook = { id: books.length + 1, title, author };
    books.push(newBook);
    res.status(201).json(newBook);  // Връщаме създадената книга
});

// Слуша на порт 5000
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
