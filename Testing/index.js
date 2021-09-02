const express = require('express');

const app = express();

app.get('/week3/marks/:prerq/:wsq/:lab' , (req, res) => {
    let workMark = req.params.prerq * 0.1 + req.params.wsq * 0.1 + req.params.lab * 0.2;
    console.log(`Calculated mark [${workMark}] and returning to client`);
    res.send('Week 3 Mark is ' + workMark);
})

app.get('/week3*', (req, res) => {
    console.log('Welcome to Week 3');
    res.send("Welcome to Week 3");
});

app.listen(8080);

// Question 2
// At a certain path, path parameters are required as they make up the path, whereas query paramaters are optional at a path
// Path parameters belong directly in the path, query parameters are extended onto the path after ? sign