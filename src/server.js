const fs = require('fs');
const http = require('http');
const path = require('path');
const { formatPost } = require('./format.js');
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
	else if (req.url.startsWith('/topics')) {
		//routeTopics(req, res)
		routeError(req, res)
	}
	else if (req.url.startsWith('/about')) {
		//routeAbout(req, res)
		routeError(req, res)
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
		res.writeHead(302, {'Location': files[0]});
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
			next_post_dir = files[post_index + 1]
		}

		let previous_posts = files.slice(0, 10)

		buildPostResponse(host, post_dir, previous_posts, next_post_dir, (postContent) => {
			sendContent(postContent, HTML_MIME, res);
		});
	})
}

function routeAbout(req, res) {
	//send about page
}

function routeTopics(req, res) {
	if (req.url.endsWith('/topics')) {
		buildTopicResponse(req, res)
	} else {
		//get specific topics
	}
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
				return b.localeCompare(a, undefined, {
					numeric: true,
					sensitivity: 'base'
				});
			});
			// drop hidden files like .DS_Store
			files = files.filter(item=> !/^\..*/.test(item))
			fn(files);
		}
	});
}

function getMetadataFiles(dir, files_) {
	files_ = files_ || [];
	var files = fs.readdirSync(dir);
	for (var i in files){
		var name = dir + '/' + files[i];
		if (fs.statSync(name).isDirectory()) {
			getMetadataFiles(name, files_);
		} else if (name.endsWith('metadata.json')) {
			files_.push(name);
		}
	}
	return files_;
}

function buildTopicResponse(req, res) {
	let sidebar_data = {}
	let host = req.headers.host
	for (file of getMetadataFiles('./posts')) {
		metadata = require(path.join(appRoot, file))
		for (topic of metadata.topics) {
			// gross hack to grab the date string out of the path :(
			let directory = file.split('/')[2]
			let url = path.join(host, directory)
			if (sidebar_data[topic]) {
				sidebar_data[topic].add(url)
			} else {
				sidebar_data[topic] = new Set()
				sidebar_data[topic].add(url)
			}
		}
	}

	//formatPost(sidebar_data)
}

function buildPostResponse(host, post_dir, previous_posts, next_post, fn) {
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