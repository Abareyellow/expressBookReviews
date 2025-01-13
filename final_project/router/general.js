const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4))
});

async function fetchBooks() {
    try {
        const response = await axios.get('http://localhost:5000/');
        const data = response.data;
        console.log(data);
    } catch (error) {
        console.error('Error', error);
    }
}

//fetchBooks();

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = parseInt(req.params.isbn);
  res.send(books[isbn])
 });

async function fetchIsbn(num) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${num}`);
        const data = response.data;
        console.log(data);
    } catch (error) {
        console.error('Error', error);
    }
}

fetchIsbn(2);
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author
    let result = [];

    for (let key in books) {
        if (books[key].author === author) {
            result.push(books[key]);
        }
    }

    res.send(result)
});

async function fetchAuthor(author) {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        const data = response.data;
        console.log(data);
    } catch (error) {
        console.error('Error', error);
    }
}

//fetchAuthor('Unknown');

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let book = {};

  for (let key in books) {
    if (books[key].title === title) {
        book = books[key]
    }
  }

  res.send(book)
});
async function fetchTitle(title) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        const data = response.data;
        console.log(data);
    } catch (error) {
        console.error('Error', error);
    }
}

//fetchTitle('Fairy tales');



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = parseInt(req.params.isbn);
    res.send(books[isbn].reviews);
});


module.exports.general = public_users;
