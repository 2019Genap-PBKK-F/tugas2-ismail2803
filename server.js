var http = require('http');

var server = http.createServer(function (req, res) {
    res.end("Hi, Nama saya Ismail");
});

server.listen(8030);

console.log("server running on http://localhost:8030");