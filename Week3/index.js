const express = require('express');
const app = express();

// Mock Database
let booksDB = [];


// Task 1: Add a new book to the book store
app.get('/addbook', (req, res) => {
    let newId = Math.round(Math.random()*1000);
    let newBook = {
        id : newId,
        title: req.query.title,
        author: req.query.author,
        topic: req.query.topic,
        cost: parseFloat(req.query.cost)
    };
    booksDB.push(newBook);
    res.send(newBook.title + ' has been added to the database');
});

// Task 2: List all books in the book store
app.get('/getallbooks', (req, res) => {
    let st = 'ID | Title | Author | Topic | Cost </br>';
    for(let i = 0; i < booksDB.length; i++){
        st += booksDB[i].id + ' | ' + booksDB[i].title + ' | ' + booksDB[i].author + ' | ' + booksDB[i].topic + ' | ' + booksDB[i].cost + '</br>';
    }
    res.send(st);
});

// Task 3: Delete a book by id from the book store
app.get('/deleteid/:delid', (req, res) => {
    booksDB = booksDB.filter((book) => {return book.id !== parseInt(req.params.delid)});
    console.log(booksDB);
    res.send(req.params.delid + ' has been deleted');
});

// Task 4: Get total value of the book store
app.get('/getbookstorevalue', (req, res) => {
    let totalValue = booksDB.reduce((total, book) => {return total += (book.cost) }, 0);
    console.log(totalValue);
    res.send('The total value of bookstore is: ' + totalValue);
});

// Extra Task: Get count of books in a category
app.get('/booksinacategory/:category' , (req, res) => {
    let category = req.params.category;
    let count = booksDB.reduce((total, book) => {
        if(book.topic == category){
            total++;
        }
        return total;
    }, 0);

    res.send(`The total number of books in the ${category} category is: ${count}`);

});

app.listen(8080);