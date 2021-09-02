const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
    console.log(req.url);
    var baseURL = "http://" + req.headers.host + "/";
    var url = new URL(req.url, baseURL);
    res.writeHead(200, {
        "Content-Type": "text/html",
      });

    if(url.pathname == '/whichweek/'){
        let weekNumber = getDaysDiff(url.searchParams.get('d'), url.searchParams.get('m'), url.searchParams.get('y'));
        res.write('<html><body><h3><a href="/">Return to home</a></h3>');
        if(weekNumber == -1){
            res.write('<p><b>Error:</b> The input date is before the 26th of July, 2021</p>');
        } else if (weekNumber > 14){
            res.write('<p><b>Error:</b> The input date is after Week 14</p>'); 
        } else {
            res.write('<p>The input date is in Week ' + weekNumber + '</p>');
        }
        res.write('</body></html>');
        res.end();

    }
   
    let fileName = '';
    switch(req.url) {
        case '/':
            fileName = 'index.html';
            break;
        case '/assignments':
            fileName = 'Assignments.html'
            break;
        case '/topics':
            fileName = 'Topics.html';
            break;
        case '/help':
            fileName = 'help.html';
            break;
        default:
            fileName = '404.html';
            break;
    }
    fs.readFile(fileName, (error, content) => {
        res.end(content, 'utf-8');
    })


}).listen(5050);


/**
 * 
 * @param {day} d 
 * @param {month} m 
 * @param {year} y 
 * @returns week number since August 3,2021; returns -1 if the input is before 3rd of August 2020
 */
 function getDaysDiff(d, m, y) {
    let returnValue = -1;
    let currentDay = new Date();
    currentDay.setDate(parseInt(d));
    currentDay.setMonth(parseInt(m) - 1); // months start from 0
    currentDay.setYear(parseInt(y));
    let firstDay = new Date("7/26/2021"); // first day in semester 2
    if (currentDay >= firstDay) {
        var diffDays = parseInt((currentDay - firstDay) / (1000 * 60 * 60 * 24)); //gives day difference 
        returnValue = (Math.floor(diffDays / 7) + 1);
    }
    return (returnValue);
}