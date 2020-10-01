const fs = require('fs');
const http = require('http');
const path = require('path');

const bad_request = "Invalid Request!"
const page_uri = 'resources/page.html';
const page_mime = {'Content-Type': 'text/html' };
const style_uri = 'resources/style.css';
const style_mime = {'Content-Type': 'text/css' };

function readFile(relativePath, mime, fn) {
	var fullPath = path.join(__dirname, relativePath);
	fs.readFile(fullPath, 'utf-8', 
		function fileRead(err, text) {
			fn(err, mime, text);
		});
	}

var server = http.createServer(function (req, res) {

	function respond(err, mime, raw_content) {
		if (err) {
			res.writeHead(500, mime);
			console.log(err);
			raw_content = bad_request;
		} else {
			res.writeHead(200, mime);
		}
		res.end(raw_content);
	}
	
	if (req.url == '/') {
		readFile(page_uri, page_mime, respond);
	}
	else if (req.url == '/style.css')
	{
		readFile(style_uri, style_mime, respond);
	}
});

server.listen(5000);
console.log('Server online and listening at port 5000...');
