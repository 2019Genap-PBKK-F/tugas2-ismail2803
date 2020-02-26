var express = require('express');
var app = express();
const hostname = '10.199.14.46';
const port = 8030;
 
app.get("/product",function(request,response)
{
    response.json({"Message":"Welcome to Node js"});
});
 
app.listen(port, function () {
    var datetime = new Date();
    var message = "Server runnning on Port:- " + port + "Started at :- " + datetime;
    console.log(message);
});

