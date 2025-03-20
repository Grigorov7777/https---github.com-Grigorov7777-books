const express = require('express');
const app = express();
const port = 5000;

app.use(express.json()); // Позволява на сървъра да чете JSON данни

// Мок данни (тук ще добавим списък с книги или друга информация)
let books = [
    { id: 1, title: '1984', author: 'George Orwell' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' }
];

// Рут за получаване на всички книги
app.get('/api/books', (req, res) => {
    res.json(books);
});

// Рут за добавяне на нова книга
app.post('/api/books', (req, res) => {
    const { title, author } = req.body;
    const newBook = { id: books.length + 1, title, author };
    books.push(newBook);
    res.status(201).json(newBook);
});

// Рут за изтриване на книга по ID
app.delete('/api/books/:id', (req, res) => {
    const { id } = req.params;
    books = books.filter(book => book.id != id);
    res.status(204).end();
});

// Старт на сървъра
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

