const fs = require('fs');
const http = require('http');
const path = require('path');
const format = require('./format.js');

const CSS_MIME  = { 'Content-Type': 'text/css' };
const HTML_MIME = { 'Content-Type': 'text/html' };
const ICO_MIME  = { 'Content-Type': 'image/x-icon' };
const JPG_MIME  = { 'Content-Type': 'image/jpg' };
const PNG_MIME  = { 'Content-Type': 'image/png' };
const appRoot = path.join(__dirname, '../');
const port = process.env.PORT || 5000;

let server = http.createServer(function (req, res) {
	const host = req.headers.host;
	if (req.url == '/') {
		routeMostRecentPost(res)
	}
	else if (req.url.match(/\d{4}-\d{2}-\d{2}$/)) {
		routeSpecificPost(host, req.url, res);
	}
	else if (req.url == '/style.css') {
		let uri = path.join(appRoot, 'resources', 'style.css');
		routeCSS(uri, res)
	}
	else if (req.url == '/favicon.ico') {
		let uri = path.join(appRoot, 'resources', 'favicon.ico');
		routeImage(uri, ICO_MIME, res)
	}
	else if (req.url == '/icon.png') {
		let uri = path.join(appRoot, 'resources', 'icon.png');
		routeImage(uri, PNG_MIME, res)
	}
	else if (req.url.endsWith('.jpg') || req.url.endsWith('.jpeg')) {
		let uri = path.join(appRoot, req.url);
		routeImage(uri, JPG_MIME, res)
	}
	else if (req.url.endsWith('.png')) {
		let uri = path.join(appRoot, req.url);
		routeImage(uri, PNG_MIME, res)
	}
	else {
		routeError(req, res)
	}
});

function routeCSS(uri, res) {
	fs.readFile(uri, 'utf8', (err, data) => {
		sendContent(data, CSS_MIME, res);
	});
}

function routeImage(uri, mimetype, res) {
	fs.readFile(uri, (err, data) => {
		sendContent(data, mimetype, res);
	});
}

function routeMostRecentPost(res) {
	console.log("Redirecting to most recent post")
	getAllPostsByDate((files) => {
		res.writeHead(302, {'Location': files[files.length - 1]});
		res.end();
	});
}

function routeSpecificPost(host, url, res) {
	getAllPostsByDate((files) => {
		// check for matching post
		let post_index = 0;
		for (const [index, post] of files.entries()) {
			if (post === url.substring(1)) {
				console.log("Post", post, "requested");
				post_index = index;
			}
		}
	
		const post_dir = files[post_index]

		let next_post_dir
		if (post_index + 1 < files.length) {
			next_post_dir = files[post_index + 1];
		}

		let previous_posts = []
		while (post_index > 0) {
			previous_posts.push(files[post_index])
			post_index -= 1
		}

		buildResponse(host, post_dir, previous_posts, next_post_dir, (postContent) => {
			sendContent(postContent, HTML_MIME, res);
		});
	})
}

function routeError(req, res) {
	console.log("Invalid route " + req.url)
	fs.readFile('resources/error.html', 'utf8', (err, html) => {
		sendContent(html, HTML_MIME, res)
	})
}

function getAllPostsByDate(fn) {
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
			fn(files);
		}
	});
}

function buildResponse(host, post_dir, previous_posts, next_post, fn) {
	const metadata_path = path.join(appRoot, './posts', post_dir, 'metadata.json')
	const markdown_path = path.join(appRoot, './posts', post_dir, 'post.md')
	const html_path     = path.join(appRoot, './resources', 'page.html')

	let post_data = {
		host: host,
		directory: post_dir,
		previous_posts: previous_posts,
		last_post_url: previous_posts[0],
		next_post_url: next_post,
		html_dir: html_path,
		metadata: require(metadata_path)
	}

	fs.readFile(html_path, 'utf8', (err, html) => {
		post_data.html = html;
		fs.readFile(markdown_path, 'utf8', (err, markdown) => {
			post_data.markdown = markdown;
			format.formatPost(post_data, fn);
		});
	});
}

function sendContent(content, mime, res) {
	res.writeHead(200, mime);
	res.end(content);
}

server.listen(port);
console.log('Server online and listening at port ' + port);