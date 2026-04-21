const express = require('express');
let books = require("./booksdb.js");
const send = require('send');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


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

// Get the books by ISBN using async/await
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject(new Error("Book not found"));
      }
    });
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Get the books by Author using async/await
public_users.get('/async/author/:author', async (req, res) =>  {
  try {
    const author = decodeURIComponent(req.params.author);
    const matchingBooks = await new Promise ((resolve, reject) => {
      const result = Object.keys(books)
      .filter(key => books[key].author === author)
      .map(key => books[key]);

      if(result.length > 0) {
        resolve(result);
      } else {
        reject(new Error("No books found for this author"));
      }
    });
    res.status(200).json(matchingBooks);
  } catch (error) {
    res.status(404).json({ message:error.message })
  }
})

// Get the book by title using async/await
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const title = decodeURIComponent(req.params.title);
    const matchingBooks = await new Promise((resolve, reject) => {
      const result = Object.keys(books)
        .filter(key => books[key].title === title)
        .map(key => books[key]);
      if (result.length > 0) {
        resolve(result);
      } else {
        reject(new Error("No books found for this title"));
      }
    });
    res.status(200).json(matchingBooks);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports.general = public_users;
