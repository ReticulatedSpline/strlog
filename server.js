const fs = require('fs');
const http = require('http');
const path = require('path');

const bad_request = "Invalid Request!"
const page_uri = 'resources/page.html';
const page_mime = {'Content-Type': 'text/html' };
const style_uri = 'resources/style.css';
const style_mime = {'Content-Type': 'text/css' };
const favicon_uri = 'resources/favicon.png';
const favicon_mime = {'Content-Type': 'image/png' };
const first_post = './posts/2020-10-1'

function readFile(relativePath, mime, fn) {
	let fullPath = path.join(__dirname, relativePath);
	fs.readFile(fullPath, function fileRead(err, text) {
			fn(err, mime, text);
	});
}

function formatPost(html, post) {
	let content_regex = /{{content}}/;
	post = html.replace(content_regex, post);
	let title_regex = /#\s(.+)/g;
	post = post.replace(title_regex, '<h1>$1</h1><br>');
	let link_regex = /[^!]\[(.+)\]\((.+)\)/g;
	post = post.replace(link_regex, '<a href="$2">$1</a>');
	let image_regex = /!\[(.*)\]\((.+)\)/g;
	post = post.replace(image_regex, '<br><br><img class="center" src="$2" alt="$1"><br>');
	return post;
}

function getPost(res) {
	let html_path = path.join(__dirname, 'resources/page.html');
	fs.readFile(html_path, 'utf8', function (html_error, html) {
		if (html_error) {
			return console.log(html_error);
		}

		let post_path = path.join(__dirname, first_post + '.md')
		fs.readFile(post_path, 'utf8', function (post_error, post) {
			if (post_error) {
				return console.log(post_error);
			}
			res.end(formatPost(html, post));
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
		readFile(favicon_uri, favicon_mime, respond);
	}
});

server.listen(5000);
console.log('Server online and listening at port 5000...');