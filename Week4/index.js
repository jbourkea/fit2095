const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static('css'));
app.use(express.static('images'));

let booksDB = [];

app.get('/', (req, res) => {
    res.render('index.html');
})

app.get('/newbook', (req, res) => {
    res.render('newBook.html');
});

app.post('/newbook', (req, res) => {
    let {title, author, topic, cost} = req.body;
    let err = '';
    console.log(title , author, topic, cost);
    if(title.length < 3){
        err = "Title less than 3 characters";
    } else if (author.length < 3){
        err = "Author less than 3 characters";
    } else if (topic.length < 3){
        err = "Topic less than 3 characters";
    } else if (cost < 0){
        err = "Cost cannot be negative";
    } else {
        let newbook = {
            title:title,
            author:author,
            topic:topic,
            cost:cost
        };
        booksDB.push(newbook);
        console.log(typeof cost);
        res.render('allBooks.html', {db:booksDB});
    }
    res.render('invalidData.html', {err:err});
});

app.get('/allbooks', (req, res) => {
    res.render('allBooks.html', {db:booksDB});
});

app.get('/search/:titleQuery', (req, res) => {
    let query = req.params.titleQuery.toUpperCase();
    console.log(query);
    let results = booksDB.filter( book => {
        return book.title.toUpperCase().includes(query)
    })
    console.log(results);
    res.render('allBooks.html', {db:results});
} );


app.get('/*', (req, res) => {
    res.render('404.html');
})




app.listen(8080);