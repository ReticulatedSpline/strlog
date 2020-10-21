const fs = require('fs');
const http = require('http');
const path = require('path');
const format = require('./format.js');
const util = require('util');

const CSS_MIME = { 'Content-Type': 'text/css' };
const HTML_MIME = { 'Content-Type': 'text/html' };
const ICO_MIME = { 'Content-Type': 'image/x-icon' };
const JPG_MIME = { 'Content-Type': 'image/jpg' };
const appRoot = path.join(__dirname, '../');
const port = process.env.PORT || 5000;

function readPost(index, posts, fn) {
	const postMarkdown = path.join(appRoot, 'posts', posts[index], 'post.md');
	const postHTML = path.join(appRoot, 'resources', 'page.html');
	const lastPost = index > 0 ? posts[index - 1] : null;
	const nextPost = posts.length > index ? posts[index + 1] : null;
	fs.readFile(postHTML, 'utf8', (err, html) => {
		fs.readFile(postMarkdown, 'utf8', (err, post) => {
			format.formatPost(html, post, lastPost, nextPost, fn);
		});
	});
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
	// redirect to most recent post
	if (req.url == '/') {
		getPostsByDate((files) => {
			res.writeHead(302, {'Location': files[0]});
			res.end();
		});
	}
	// load a generic post
	else if (req.url.match(/\d{4}-\d{2}-\d{2}$/)) {
		getPostsByDate((files) => {
			// check for matching post
			let postIndex = 0;
			for (const [index, post] of files.entries()) {
				if (post === req.url.substring(1)) {
					console.log("Found post directory", post, "at index", postIndex);
					postIndex = index;
				}
			}
			readPost(postIndex, files, (postContent) => {
				sendContent(postContent, HTML_MIME, res);
			});
		})
	}
	else if (req.url == '/style.css') {
		let uri = path.join(appRoot, 'resources', 'style.css');
		fs.readFile(uri, 'utf8', (err, data) => {
			sendContent(data, CSS_MIME, res);
		});
	}
	else if (req.url == '/favicon.ico') {
		let uri = path.join(appRoot, 'resources', 'favicon.ico');
		fs.readFile(uri, (err, data) => {
			sendContent(data, ICO_MIME, res);
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