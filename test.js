const http = require('http');
const hostname = '10.199.14.46';
const port = 8030;


var server = http.createServer(function (req, res) {
    res.end("Hi Dunia!");
});

server.listen(port);

console.log(`server running on http://${hostname}:${port}/`);