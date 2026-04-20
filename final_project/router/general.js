const express = require('express');
let books = require("./booksdb.js");
const send = require('send');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" })
  }

  const userExist = users.some(user => user.username === username);
  if (userExist) {
    return res.status(409).json ({ messag: "Username already exist" })
  }

  users.push ({ username, password });
  res.status(200).json ({ message: "User registered successfully" })
})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  res.send(books[isbn])
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);

  const matchingBooks = bookKeys
  .filter(key => books[key].author === author)
  .map(key => books[key]);

  res.send(matchingBooks)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const matchingTitle = bookKeys
  .filter(key => books[key].title === title)
  .map(key => books[key])

  res.send(matchingTitle)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
