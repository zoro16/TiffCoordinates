"use static"
var express = require('express');
var fs = require('fs');
var url = require('url');

var path = require('path');
var formidable = require('formidable');


var app = express();

app.use(express.static('src'));

app.listen(3000);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/html/index.html');
});


app.post('/save', function(req, res){
    res.type('json');
    var contents = ''
    var content = ''
    var header = 'ID   |   X   |   Y \n ---------------------- \n';
    filePath = __dirname + '/area_coordinates.txt';
    req.on('data', function(data) {
        var data = JSON.parse(data.toString());
        console.log(data[0].areaId);
        for(var i=0; i<data.length; i++){
            content += " " + data[i].areaId + "     " + data[i].x + "     " + data[i].y + "\n";
        }
        body = header + content;
        console.log(content);

    });


    req.on('end', function (){
        fs.appendFile(filePath, body, function() {
            res.end();
        });
    });
    console.log("saved" + res);
});
