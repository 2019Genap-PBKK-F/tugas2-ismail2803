var express = require('express');
var app = express();
const hostname = '10.199.14.46';
const port = 8030;

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var mahasiswaController = require('./Controller/MahasiswaController')();

app.get("/",function(request, response)
{
    response.json({"Message":"Welcome"});
});
app.use("/api/mahasiswa", mahasiswaController);

app.listen(port, function () {
    var message = "Server runnning on Port: " + port;
    console.log(message);
});

