const fs = require('fs');
const http = require('http');
const path = require('path');
const format = require('./format.js');
const util = require('util');

const CSS_MIME = {'Content-Type': 'text/css' };
const HTML_MIME = {'Content-Type': 'text/html' };
const PNG_MIME = {'Content-Type': 'image/png' };
const JPG_MIME = {'Content-Type': 'image/jpg' };
const appRoot = path.join(__dirname, '../');
const port = process.env.PORT || 5000;

function readPost(dir, fn) {
	const postMarkdown = path.join(appRoot, 'posts', dir, 'post.md');
	const postHTML = path.join(appRoot, 'resources', 'page.html');
	fs.readFile(postHTML, 'utf8', (err, html) => {
		fs.readFile(postMarkdown, 'utf8', (err, post) => {
			format.formatPost(html, post, fn);
		})
	})
}

function getPostsByDate(fn) {
	fs.readdir(path.join(appRoot, 'posts'), (err, files) => {
		if (err) {
			console.log('Error fetching files: ', err);
		}
		else {
			files.sort((a, b) => a - b);
			fn(files);
		}
	});
}

function sendContent(content, mime, res) {
	res.writeHead(200, mime);
	res.end(content);
}

let server = http.createServer(function (req, res) {

	if (req.url == '/') {
		getPostsByDate((files) => {
			readPost(files[0], (postContent) => {
				sendContent(postContent, HTML_MIME, res);
			});
		});
	}

	else if (req.url == '/style.css')
	{
		let uri = path.join(appRoot, 'resources', 'style.css');
		fs.readFile(uri, 'utf8', (err, data) => {
			sendContent(data , CSS_MIME, res);
		});
	}
	else if (req.url == '/favicon.png')
	{
		let uri = path.join(appRoot, 'resources', 'favicon.ico');
		fs.readFile(uri, (err, data) => {
			sendContent(data, PNG_MIME, res);
		});
	}
	else if (req.url.endsWith('.jpg')) {
		let uri = path.join(appRoot, req.url);
		fs.readFile(uri, (err, data) => {
			sendContent(data, JPG_MIME, res);
		});
	}
});

server.listen(port);
console.log('Server online and listening at port ' + port);