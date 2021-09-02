const http  = require('http');

http.createServer((request, response) => {
    response.writeHead(200);

    switch(request.url){
        case "/sem":
            response.write("Its S2 2021");
            break;
        case '/quiz':
            response.write("Workshop Quiz 2");
            break;
        default:
            response.write("Unknown pathname");
            break;
    }
    response.end();
}).listen(5678);