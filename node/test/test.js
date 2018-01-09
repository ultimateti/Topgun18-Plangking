/*

var http = require('http');

http.createServer(function (req, res) {
	res.writeHead(200,{"Content-Type":"text/html"});
  	res.write('<marquee>Hello World!</marquee>'); 
  	res.end();
}).listen(8080); 
*/


function hello() {
	console.log("Hello world");
}


var express = require("express");
var app = express();

var ejs = require("ejs");
app.set('view engine','ejs');

app.get('/',function(req,res) {
	users = [{
		name: "Ong"
	}, {
		name: "Tao"
	}];
	res.render('index', {
		users: users,
		title: 'TITLE EJS'
	});
});

app.get('/about',function(req,res) {
	res.send('<marquee scrollamount=10>About!</marquee>'); 
});


app.listen(8080);
hello();