const fs = require('fs');
const http = require('http');
const path = require('path');
const format = require('./format.js');

const page_uri = '../resources/page.html';
const style_uri = '../resources/style.css';
const favicon_uri = '../resources/favicon.png';
const style_mime = {'Content-Type': 'text/css' };
const page_mime = {'Content-Type': 'text/html' };
const png_mime = {'Content-Type': 'image/png' };
const jpg_mime = {'Content-Type': 'image/jpg' };
const first_post = '../posts/2020-10-01'
const port = process.env.PORT || 5000;

function readFile(relativePath, mime, fn) {
	let fullPath = path.join(__dirname, relativePath);
	fs.readFile(fullPath, function fileRead(err, text) {
			fn(err, mime, text);
	});
}

function getPost(res) {
	let html_path = path.join(__dirname, page_uri);
	fs.readFile(html_path, 'utf8', function (html_error, html) {
		if (html_error) {
			return console.log(html_error);
		}

		let post_path = path.join(__dirname, first_post + '/post.md')
		fs.readFile(post_path, 'utf8', function (post_error, post) {
			if (post_error) {
				return console.log(post_error);
			}
			res.end(format.formatPost(html, post));
		})
	})
}

let server = http.createServer(function (req, res) {

	function respond(err, mime, raw_content) {
		if (err) {
			console.log(err);
			return;
		} else {
			res.writeHead(200, mime);
		}

		if (mime === page_mime) {
			getPost(res);
		} else {
			res.end(raw_content);
		}
	}
	
	if (req.url == '/') {
		readFile(page_uri, page_mime, respond);
	}
	else if (req.url == '/style.css')
	{
		readFile(style_uri, style_mime, respond);
	}
	else if (req.url == '/favicon.png')
	{
		readFile(favicon_uri, png_mime, respond);
	}
	else if (req.url.endsWith('.jpg')) {
		readFile(path.join('../', req.url), jpg_mime, respond);
	}
});

server.listen(port);
console.log('Server online and listening at port ' + port);