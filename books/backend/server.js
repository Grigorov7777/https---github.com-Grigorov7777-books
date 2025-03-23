const express = require('express');
const cors = require('cors');  // Добави тази линия, ако все още не си го направил
const app = express();
const port = 5000;

app.use(cors());  // Активираме CORS, за да позволим заявките от различни източници
app.use(express.json());

let books = [
    { id: 1, title: '1984', author: 'George Orwell' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' }
];

app.get('/api/books', (req, res) => {
    res.json(books);
});

app.post('/api/books', (req, res) => {
    const { title, author } = req.body;
    const newBook = { id: books.length + 1, title, author };
    books.push(newBook);
    res.status(201).json(newBook);
});

app.delete('/api/books/:id', (req, res) => {
    const { id } = req.params;
    books = books.filter(book => book.id != id);
    res.status(204).end();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
