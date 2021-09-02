const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
const morgan = require('morgan');
const ejs = require('ejs');
const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan("common"));
app.listen(8080);

app.use(express.static('css'));
app.use(express.static('images'));

const MongoClient = mongodb.MongoClient;
let db;
const mongoURL = "mongodb://localhost:27017/";
MongoClient.connect(mongoURL, {useNewUrlParser:true}, (err, client) => {
    if (err) {console.log("Err: " + err)}
    else {
        console.log("[DB] Connected to database successfully");
        db = client.db('w5bookstore');
    }
});

app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('/newbook', (req, res) => {
    res.render('newBook.html');
})

app.post('/newbook', (req, res) => {
    let {title, author, topic, dateofpub, summary} = req.body;
    db.collection('book').insertOne({
        title:title,
        author:author,
        topic:topic,
        dateofpub: new Date(dateofpub),
        summary:summary
    });
    res.redirect('/allbooks');
});

app.get('/allbooks', (req, res) => {
    db.collection('book').find({}).toArray((err, data) => {
        res.render('allBooks.html', {db:data});
    });
});

app.get('/deletebook', (req, res) => {
    res.render('deleteBook.html');
});

app.post('/deletebook', (req, res) => {
    let {topic} = req.body;
    db.collection('book').deleteMany({topic:topic});
    res.redirect('/allbooks');
});

app.get('/updatebook', (req, res) => {
    res.render('updateBook.html');
});

app.post('/updatebook', (req, res) => {
    let {title, author, topic, dateofpub, summary} = req.body;
    let newDate = new Date(dateofpub);
    db.collection('book').updateOne({title:title},
        {$set : {
            author:author,
            topic:topic,
            dateofpub: newDate,
            summary:summary
        }
    },
    {upsert:false},
        (err, result) => {
            res.redirect('/allbooks');
        }
        )
});

app.get('/filterdate', (req, res)=>{
    res.render('dateRange.html');
});

app.post('/filterdate', (req, res) => {
    let {fromdate, todate} = req.body;
    db.collection('book').find({$and : [{dateofpub : {$lte : new Date(todate)}}, {dateofpub: {$gte: new Date(fromdate)}}]}).toArray((err, result) => {
        console.log(err);
        res.render('allBooks.html', {db:result});
    })
});



app.get('*', (req, res) => {
    res.render('404.html');
});

