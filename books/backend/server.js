const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5000;

// Позволява CORS
app.use(cors());

// Настройка за обработка на JSON заявки
app.use(express.json());

// Настройка за файлове (съхранение на изображения)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');  // Задаваме папката за качени файлове
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Съхраняваме файла с уникално име
    }
});

const upload = multer({ storage: storage });

// Обслужване на статични файлове от папката uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Модел на данни за книги
let books = [
    { id: 1, title: '1984', author: 'George Orwell' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' }
];

// Рут за получаване на всички книги (с възможност за търсене)
app.get('/api/books', (req, res) => {
    const { search } = req.query;  // Взимаме параметър за търсене
    if (search) {
        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase())
        );
        return res.json(filteredBooks);
    }
    res.json(books);  // Връща всички книги
});

// Рут за добавяне на нова книга
app.post('/api/books', upload.single('image'), (req, res) => {
    console.log('Received body:', req.body);
    console.log('Received file:', req.file);

    const { title, author, description } = req.body;
    if (!title || !author) {
        return res.status(400).json({ message: 'Title and author are required' });
    }

    // Създаване на новата книга
    const newBook = {
        id: books.length + 1,
        title,
        author,
        description: description || '',
        image: req.file ? `/uploads/${req.file.filename}` : ''  // Път към изображението
    };

    // Добавяне на новата книга в масива
    books.push(newBook);
    res.status(201).json(newBook);  // Връща новосъздадената книга
});

// Рут за изтриване на книга по ID
app.delete('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    books = books.filter(book => book.id !== bookId);
    res.json({ message: 'Book deleted successfully' });
});

// Рут за редактиране на книга по ID
app.put('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const { title, author, description } = req.body;

    let book = books.find(book => book.id === bookId);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Редактиране на данни
    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;

    res.json(book);  // Връща редактираната книга
});

// Слушаме на порт 5000
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
