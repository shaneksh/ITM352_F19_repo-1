var http = require('http');

//create a server object:
http.createServer(function (req, res) {
    console.log(req.headers); //output the request headers to the console
    res.writeHead(301, { "Location": "http://amazon.com"});  
    res.write('<META http- equiv ="refresh" content="0;URL=http://www.google.com">');
    res.write('<script>window.location = "http://www.apple.com";');
    res.end(); //end the response
}).listen(8080); //the server object listens on port 8080

console.log('Hello world HTTP server listening on localhost port 8080');