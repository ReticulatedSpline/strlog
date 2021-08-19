const fs = require('fs');
const http = require('http');
const path = require('path');
const format = require('./format.js');

const CSS_MIME = { 'Content-Type': 'text/css' };
const HTML_MIME = { 'Content-Type': 'text/html' };
const ICO_MIME = { 'Content-Type': 'image/x-icon' };
const JPG_MIME = { 'Content-Type': 'image/jpg' };
const PNG_MIME = { 'Content-Type': 'image/png' };
const appRoot = path.join(__dirname, '../');
const port = process.env.PORT || 5000;

function readPost(index, host, posts, fn) {
	const postMarkdown = path.join(appRoot, 'posts', posts[index], 'post.md');
	const postHTML = path.join(appRoot, 'resources', 'page.html');
	const lastPost = index > 0 ? posts[index - 1] : null;
	const nextPost = posts.length > index ? posts[index + 1] : null;
	fs.readFile(postHTML, 'utf8', (err, html) => {
		fs.readFile(postMarkdown, 'utf8', (err, post) => {
			format.formatPost(html, host, post, posts[index], lastPost, nextPost, posts, fn);
		});
	});
}

function getPostsByDate(fn) {
	fs.readdir(path.join(appRoot, 'posts'), (err, files) => {
		if (err) {
			console.log('Error fetching files: ', err);
		}
		else {
			// natural sort file names (should be ISO dates!)
			files.sort(function(a, b) {
				return a.localeCompare(b, undefined, {
					numeric: true,
					sensitivity: 'base'
				});
			});
			console.log(files)
			fn(files);
		}
	});
}

function sendContent(content, mime, res) {
	res.writeHead(200, mime);
	res.end(content);
}

let server = http.createServer(function (req, res) {
	const host = req.headers.host;

	// redirect to most recent post
	if (req.url == '/') {
		getPostsByDate((files) => {
			res.writeHead(302, {'Location': files[files.length - 1]});
			res.end();
		});
	}
	// load a specific post
	else if (req.url.match(/\d{4}-\d{2}-\d{2}$/)) {
		getPostsByDate((files) => {
			// check for matching post
			let postIndex = 0;
			for (const [index, post] of files.entries()) {
				if (post === req.url.substring(1)) {
					console.log("Post", post, "requested");
					postIndex = index;
				}
			}
			readPost(postIndex, host, files, (postContent) => {
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
	else if (req.url == '/icon.png') {
		let uri = path.join(appRoot, 'resources', 'icon.png');
		fs.readFile(uri, (err, data) => {
			sendContent(data, PNG_MIME, res);
		});
	}
	else if (req.url.endsWith('.jpg') || req.url.endsWith('.jpeg')) {
		let uri = path.join(appRoot, req.url);
		fs.readFile(uri, (err, data) => {
			sendContent(data, JPG_MIME, res);
		});
	}
	else if (req.url.endsWith('.png')) {
		let uri = path.join(appRoot, req.url);
		fs.readFile(uri, (err, data) => {
			sendContent(data, PNG_MIME, res);
		});
	}
});

server.listen(port);
console.log('Server online and listening at port ' + port);