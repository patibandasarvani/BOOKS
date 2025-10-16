const express = require("express");
const app = express();
app.use(express.json());

let books = [
  { id: 1, title: "Python Programming through java", author: "sarvanii" },
  { id: 2, title: "Data Science", author: "manii" },
  { id: 3, title: "Machine learning", author: "sujji" },
];

let users = {
  1: { name: "sujji", subscribed: true, borrowed_books: [1] },
  2: { name: "manii", subscribed: false, borrowed_books: [] },
  3: { name: "sarvanii", subscribed: true, borrowed_books: [2, 3] },
};
app.get("/", (req, res) => {
  res.json({ message: " Welcome to the Library API" });
});

app.get("/books", (req, res) => {
  res.json({ books });
});
app.post("/subscribe/:userId", (req, res) => {
const id = parseInt(req.params.userId);
  if (!users[id]) return res.status(404).json({ error: "User not found" });
  users[id].subscribed = true;
  res.json({ message: `${users[id].name} subscribed successfully.` });
});

app.post("/unsubscribe/:userId", (req, res) => {  const id = parseInt(req.params.userId);
  if (!users[id]) return res.status(404).json({ error: "User not found" });
  users[id].subscribed = false;
  res.json({ message: `${users[id].name} unsubscribed successfully.` });
});
app.post("/borrow/:userId/:bookId", (req, res) => {const userId = parseInt(req.params.userId);
  const bookId = parseInt(req.params.bookId);

  if (!users[userId]) return res.status(404).json({ error: "User not found" });
  if (!books.find((b) => b.id === bookId))
    return res.status(404).json({ error: "Book not found" });

  if (users[userId].borrowed_books.includes(bookId))
    return res.json({ message: "Book already borrowed." });

  users[userId].borrowed_books.push(bookId);
  res.json({ message: `${users[userId].name} borrowed book ID ${bookId}.` });
});

app.post("/return/:userId/:bookId", (req, res) => {
  const userId = parseInt(req.params.userId);
  const bookId = parseInt(req.params.bookId);

  if (!users[userId]) return res.status(404).json({ error: "User not found" });

  const index = users[userId].borrowed_books.indexOf(bookId);
  if (index === -1)
    return res.json({ message: "This book was not borrowed by the user." });

  users[userId].borrowed_books.splice(index, 1);
  res.json({ message: `${users[userId].name} returned book ID ${bookId}.` });
});
app.get("/books/:bookId", (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const book = books.find((b) => b.id === bookId);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json({ book_details: book });
});
app.get("/users/:userId/history", (req, res) => {
  const userId = parseInt(req.params.userId);
  if (!users[userId]) return res.status(404).json({ error: "User not found" });

  const borrowed = books.filter((b) =>
    users[userId].borrowed_books.includes(b.id)
  );
  res.json({
    user: users[userId].name,
    borrowed_books: borrowed,
  });
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
