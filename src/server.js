const fs = require('fs');
const path = require('path');
const http = require('http');
const { shuffleArray, 
		getMetadataFiles,
		getAllPostsByDate,
		logConsole,
		sendContent } = require('./utilities.js');

const { formatPost,
		formatHyperlinkList,
		formatSitemap } = require('./format.js');

require('./constants.js');

let server = http.createServer(function (req, res) {
	host = req.headers.host;
	if (IS_PROD) {
		host = 'strlog.net';
	}

	if (req.url == '/') {
		logConsole("request: root, redirecting to /posts");
		res.writeHead(302, {'Location': '/posts'});
		res.end();
	}
	else if (req.url.endsWith('/posts')) {
		routeAllPosts(req, res, host);
	}
	else if (req.url.endsWith('/topics')) {
		routeAllTopics(req, res, host);
	}
	else if (req.url.match(/\/topics\/[A-z]+$/)) {
		routeSpecificTopic(req, res, host);
	}
	else if (req.url.match(/\d{4}-\d{2}-\d{2}$/)) {
		routeSpecificPost(req, res, host);
	}
	else if (req.url.endsWith('/about')) {
		routeAbout(req, res, host);
	}
	else if (req.url.endsWith('.css')) {
		let uri = path.join(APP_ROOT, 'resources', req.url);
		routeResource(uri, CSS_MIME, res);
	}
	else if (req.url == '/favicon.ico') {
		let uri = path.join(APP_ROOT, 'resources', 'favicon.ico');
		routeResource(uri, ICO_MIME, res);
	}
	else if (req.url == '/icon.png') {
		let uri = path.join(APP_ROOT, 'resources', 'icon.png');
		routeResource(uri, PNG_MIME, res);
	}
	else if (req.url.endsWith('.jpg') || req.url.endsWith('.jpeg')) {
		let uri = path.join(APP_ROOT, req.url);
		routeResource(uri, JPG_MIME, res);
	}
	else if (req.url.endsWith('.png')) {
		let uri = path.join(APP_ROOT, req.url);
		routeResource(uri, PNG_MIME, res);
	}
	else if (req.url.endsWith('.woff2')) {
		let uri = path.join(APP_ROOT, req.url);
		routeResource(uri, WOFF2_MIME, res);
	}
	else {
		routeError(req, res, host);
	}
})

function routeSitemap(req, res, host) {
	logConsole('request: sitemap');
	
	page_data = {
		html: HTML_TEMPLATE,
		host: host,
		tabs: ['posts', 'topics', 'about'],
	};

	let fn = (postContent) => {sendContent(postContent, HTML_MIME, res)};
	formatSitemap(page_data, fn);
}

function routeAllPosts(req, res, host) {
	logConsole('request: posts');
	let post_list = new Array();
	file_list = getMetadataFiles('./posts');
	file_list.sort(function(a, b) {
		return b.localeCompare(a, undefined, {
			numeric: true,
			sensitivity: 'base'
		});
	});

	// drop about
	file_list.shift();

	for (file of file_list) {
		metadata = require(path.join(APP_ROOT, file));
		// gross hack to grab the date string out of the path :(
		let directory = file.split('/')[2];
		let url = path.join(host, 'posts', directory);
		let item = {
			title: metadata.title,
			tagline: metadata.tagline,
			url: url,
			current_tab: 'posts'
		};
		post_list.push(item);
	}

	page_data = {
		html: HTML_TEMPLATE,
		host: host,
		card_list: post_list,
		site_path: '/posts',
		site_path_short: '',
		current_tab: 'posts'
	};
	
	let fn = (postContent) => {sendContent(postContent, HTML_MIME, res)};
	formatHyperlinkList(page_data, fn);
}

function routeAllTopics(req, res, host) {
	logConsole('request: topic list');
	let topics = new Set();
	for (file of getMetadataFiles('./posts')) {
		metadata = require(path.join(APP_ROOT, file));
		for (topic of metadata.topics) {
			topics.add(topic);
		}
	}

	let card_list = [];
	for (topic of topics) {
		let url = path.join(host, 'topics', topic);
		let item = {
			title: topic,
			url: url
		};
		card_list.push(item);
	}

	page_data = {
		html: HTML_TEMPLATE,
		host: host,
		card_list: card_list,
		site_path: '/topics',
		site_path_short: '',
		current_tab: 'topics'
	};

	let fn = (postContent) => {sendContent(postContent, HTML_MIME, res)};
	formatHyperlinkList(page_data, fn);
}

function routeSpecificPost(req, res, host) {
	getAllPostsByDate((files) => {
		// check for matching post
		let post_index = 0;
		let found = false;
		for (const [index, post] of files.entries()) {
			if (post === req.url.split('/')[2]) {
				logConsole('request: post ' + post);
				post_index = index;
				found = true;
			}
		}

		if (!found) {
			routeError(req, res);
		}
	
		const post_dir = files[post_index];

		let last_post = null;
		if (post_index < files.length) {
			last_post = files[post_index + 1];
		}

		let next_post = null;
		if (post_index > 0) {
			next_post = files[post_index - 1];
		}

		let previous_posts = files.slice(0, 10);

		const metadata_path = path.join(APP_ROOT, './posts', post_dir, 'metadata.json');
		const markdown_path = path.join(APP_ROOT, './posts', post_dir, 'post.md');
	
		let page_data = {
			host: host,
			directory: post_dir,
			site_path: '/posts/' + post_dir,
			site_path_short: '',
			previous_posts: previous_posts,
			last_post: last_post,
			next_post: next_post,
			html_dir: HTML_PATH,
			metadata: require(metadata_path)
			//current_tab: 'posts'
		};
		
		let fn = (page) => {sendContent(page, HTML_MIME, res)};
		page_data.html = HTML_TEMPLATE;
		fs.readFile(markdown_path, 'utf8', (err, markdown) => {
			page_data.markdown = markdown;
			formatPost(page_data, fn);
		})
	})
}

function routeSpecificTopic(req, res, host) {
	let url_parts = req.url.split('/');
	let topic = url_parts[url_parts.length - 1];
	logConsole('request: topic ' + topic);
	file_list = getMetadataFiles('./posts');
	file_list.sort(function(a, b) {
		return b.localeCompare(a, undefined, {
			numeric: true,
			sensitivity: 'base'
		});
	});

	// drop about
	file_list.shift();
	let card_list = [];
	for (file of file_list) {
		metadata = require(path.join(APP_ROOT, file));
		if (!metadata.topics.includes(topic)) {
			continue;
		}

		// get directory name
		let directory = file.split('/')[2];
		let url = path.join(host, 'posts', directory);
		let item = {
			title: metadata.title,
			tagline: metadata.tagline,
			url: url,
		};
		card_list.push(item);
	}

	page_data = {
		html: HTML_TEMPLATE,
		host: host,
		card_list: card_list,
		site_path: '/topics/' + topic,
		site_path_short: topic,
		current_tab: 'topics'
	};
	
	let fn = (postContent) => {sendContent(postContent, HTML_MIME, res)};
	formatHyperlinkList(page_data, fn);
}

function routeAbout(req, res, host) {
	logConsole('request: about page');
	fs.readFile('./posts/about/post.md', 'utf8', (err, markdown) => {
		if (err) {
			logConsole('error: about page ' + error);
			return;
		}
		let link_count = parseInt(Math.random() * 10) + 3;
		let metadata_path = path.join(APP_ROOT, './posts/about/metadata.json');
		let metadata = require(metadata_path);
		let navbar_links = shuffleArray(metadata.links);
		let post_list = [];
		while (link_count > 0) {
			let random_number = parseInt(Math.random() * 10) + 3;
			let navbar_string = '<a class="tab" href="' + navbar_links[link_count] + '">';
			navbar_string += '▒'.repeat(random_number);
			navbar_string += '</a>';
			post_list.push(navbar_string);
			link_count -= 1;
		}

		let page_data = {
			html: HTML_TEMPLATE,
			host: host,
			directory: 'about',
			site_path: '/about',
			site_path_short: '',
			markdown: markdown,
			metadata: metadata,
			previous_posts: post_list,
			current_tab: 'about',
			no_url: true
		};

		let fn = (page) => {sendContent(page, HTML_MIME, res)};
		formatPost(page_data, fn);
	})
}

function routeResource(uri, mimetype, res) {
	fs.readFile(uri, (err, data) => {
		sendContent(data, mimetype, res);
	})
}

function routeError(req, res) {
	logConsole('error: invalid route ' + req.url);
	fs.readFile(ERROR_PATH, 'utf8', (err, html) => {
		sendContent(html, HTML_MIME, res);
	})
}

const HTML_TEMPLATE = fs.readFileSync(HTML_PATH, 'utf8');
const PORT = 5000;
server.listen(PORT);
logConsole('server running in ' + MODE_STRING + ' mode and listening on port ' + PORT);