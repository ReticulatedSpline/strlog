const fs = require('fs')
const path = require('path')
const http = require('http')
const { shuffleArray } = require('./utilities.js')
const { formatPost,
		formatTopic,
		formatPostList,
		formatHomepage } = require('./format.js')
require('./constants.js')

let server = http.createServer(function (req, res) {
	host = req.headers.host;
	if (IS_PROD) {
		host = 'strlog.net'
	}

	if (req.url == '/') {
		routeAllPosts(req, res, host)
	}
	else if (req.url == '/posts') {
		routeAllPosts(req, res, host)
	}
	else if (req.url.match(/\d{4}-\d{2}-\d{2}$/)) {
		routeSpecificPost(host, req.url, res)
	}
	else if (req.url.endsWith('/topics')) {
		routeAllTopics(req, res, host)
	}
	else if (req.url.match(/\/topics\/[A-z]+$/)) {
		routeSpecificTopic(req, res, host)
	}
	else if (req.url.endsWith('/about')) {
		routeAbout(req, res, host)
	}
	else if (req.url.endsWith('.css')) {
		let uri = path.join(APP_ROOT, 'resources', req.url)
		routeCSS(uri, res)
	}
	else if (req.url == '/favicon.ico') {
		let uri = path.join(APP_ROOT, 'resources', 'favicon.ico')
		routeImage(uri, ICO_MIME, res)
	}
	else if (req.url == '/icon.png') {
		let uri = path.join(APP_ROOT, 'resources', 'icon.png')
		routeImage(uri, PNG_MIME, res)
	}
	else if (req.url.endsWith('.jpg') || req.url.endsWith('.jpeg')) {
		let uri = path.join(APP_ROOT, req.url)
		routeImage(uri, JPG_MIME, res)
	}
	else if (req.url.endsWith('.png')) {
		let uri = path.join(APP_ROOT, req.url)
		routeImage(uri, PNG_MIME, res)
	}
	else {
		routeError(req, res)
	}
})

function routeCSS(uri, res) {
	fs.readFile(uri, 'utf8', (err, data) => {
		sendContent(data, CSS_MIME, res)
	})
}

function routeImage(uri, mimetype, res) {
	fs.readFile(uri, (err, data) => {
		sendContent(data, mimetype, res)
	})
}

function routeSpecificPost(host, url, res) {
	getAllPostsByDate((files) => {
		// check for matching post
		let post_index = 0
		for (const [index, post] of files.entries()) {
			if (post === url.substring(1)) {
				logConsole('request: post ' + post)
				post_index = index
			}
		}
	
		const post_dir = files[post_index]

		let next_post_dir = null
		if (post_index < files.length) {
			next_post_dir = files[post_index + 1]
		}

		let last_post_dir = null
		if (post_index > 0) {
			last_post_dir = files[post_index - 1]
		}

		let previous_posts = files.slice(0, 10)

		buildPostResponse(host, post_dir, previous_posts, last_post_dir, next_post_dir, (postContent) => {
			sendContent(postContent, HTML_MIME, res)
		})
	})
}

function routeAbout(req, res, host) {
	logConsole('request: about page')
	fs.readFile('./posts/about/post.md', 'utf8', (err, markdown) => {
		if (err) {
			logConsole('error: about page ' + error)
			return
		}
		let link_count = parseInt(Math.random() * 10) + 3
		let metadata_path = path.join(APP_ROOT, './posts/about/metadata.json')
		let metadata = require(metadata_path)
		let sidebar_links = shuffleArray(metadata.links)
		let post_list = []
		while (link_count > 0) {
			let random_number = parseInt(Math.random() * 10) + 3
			let sidebar_string = '<a class="tab" href="' + sidebar_links[link_count] + '">'
			sidebar_string += '▒'.repeat(random_number)
			sidebar_string += '</a>'
			post_list.push(sidebar_string)
			link_count -= 1
		}

		fs.readFile(HTML_PATH, 'utf8', (err, html) => {
			
			let page_data = {
				html: html,
				host: host,
				directory: 'about',
				markdown: markdown,
				metadata: metadata,
				previous_posts: post_list,
				current_tab: 'about',
				no_url: true
			}
			let fn = (page) => {sendContent(page, HTML_MIME, res)}
			formatPost(page_data, fn)
		})
	})
}

function routeError(req, res) {
	logConsole('error: invalid route ' + req.url)
	fs.readFile(ERROR_PATH, 'utf8', (err, html) => {
		sendContent(html, HTML_MIME, res)
	})
}

function routeHomepage(req, res) {
	logConsole('request: homepage')
	fs.readFile(ERROR_PATH, 'utf8', (err, html) => {
		sendContent(html, HTML_MIME, res)
	})
}

function routeSpecificTopic(req, res, host) {
	let topics = {}
	let current_topic = {}
	let url_parts = req.url.split('/')
	let topic_name = url_parts[url_parts.length - 1]
	logConsole('request: topic ' + topic_name)
	for (file of getMetadataFiles('./posts')) {
		metadata = require(path.join(APP_ROOT, file))
		for (topic of metadata.topics) {
			// gross hack to grab the date string out of the path :(
			let directory = file.split('/')[2]
			let item = {
				title: metadata.title,
				tagline: metadata.tagline,
				url: path.join(host, directory)
			}
			if (topics[topic]) {
				topics[topic].add(item)
			} else {
				topics[topic] = new Set()
				topics[topic].add(item)
			}
			if (topic == topic_name) {
				current_topic = topic
			}
		}
	}

	buildTopicResponse(req, res, host, topics, current_topic)
}

function routeAllTopics(req, res, host) {
	let topics = {}
	let current_topic = {}
	logConsole('request: topic list')
	for (file of getMetadataFiles('./posts')) {
		metadata = require(path.join(APP_ROOT, file))
		for (topic of metadata.topics) {
			// gross hack to grab the date string out of the path :(
			let directory = file.split('/')[2]
			let url = path.join(host, directory)
			let item = {
				title: metadata.title,
				tagline: metadata.tagline,
				url: url
			}
			if (topics[topic]) {
				topics[topic].add(item)
			} else {
				topics[topic] = new Set()
				topics[topic].add(item)
			}
			current_topic = topic
		}
	}

	buildTopicResponse(req, res, host, topics, current_topic)
}

function routeAllPosts(req, res, host) {
	logConsole('request: posts')
	let post_list = new Array();
	for (file of getMetadataFiles('./posts')) {
		metadata = require(path.join(APP_ROOT, file))
		// gross hack to grab the date string out of the path :(
		let directory = file.split('/')[2]
		let url = path.join(host, directory)
		let item = {
			title: metadata.title,
			tagline: metadata.tagline,
			url: url
		}
		post_list.push(item)
	}

	buildPostListResponse(req, res, host, post_list)
}

function getAllPostsByDate(fn) {
	fs.readdir(path.join(APP_ROOT, 'posts'), (err, files) => {
		if (err) {
			logConsole('error: post list ' + err)
		}
		else {
			// natural sort file names (should be ISO dates!)
			files.sort(function(a, b) {
				return b.localeCompare(a, undefined, {
					numeric: true,
					sensitivity: 'base'
				})
			})
			// drop hidden dir names, alphabetic dir names
			files = files.filter(item=> !/^[A-z\.].*/.test(item))
			fn(files)
		}
	})
}

function getMetadataFiles(dir, files_) {
	files_ = files_ || []
	var files = fs.readdirSync(dir)
	for (var i in files){
		var name = dir + '/' + files[i]
		if (fs.statSync(name).isDirectory()) {
			getMetadataFiles(name, files_)
		} else if (name.endsWith('metadata.json')) {
			files_.push(name)
		}
	}
	return files_
}

function buildTopicResponse(req, res, host, topics, current_topic) {
	fs.readFile(HTML_PATH, 'utf8', (err, html) => {
		page_data = {
			html: html,
			host: host,
			topics: topics,
			current_topic: current_topic,
			current_tab: 'topics'
		}
		let fn = (postContent) => {sendContent(postContent, HTML_MIME, res)}
		formatTopic(page_data, fn)
	})
}

function buildPostListResponse(req, res, host, post_list) {
	fs.readFile(HTML_PATH, 'utf8', (err, html) => {
		page_data = {
			html: html,
			host: host,
			post_list: post_list
		}
		let fn = (postContent) => {sendContent(postContent, HTML_MIME, res)}
		formatPostList(page_data, fn)
	})
}


function buildPostResponse(host, post_dir, previous_posts, next_post, last_post, fn) {
	const metadata_path = path.join(APP_ROOT, './posts', post_dir, 'metadata.json')
	const markdown_path = path.join(APP_ROOT, './posts', post_dir, 'post.md')

	let post_data = {
		host: host,
		directory: post_dir,
		previous_posts: previous_posts,
		last_post_url: last_post,
		next_post_url: next_post,
		html_dir: HTML_PATH,
		metadata: require(metadata_path),
		current_tab: 'posts'
	}

	fs.readFile(HTML_PATH, 'utf8', (err, html) => {
		post_data.html = html
		fs.readFile(markdown_path, 'utf8', (err, markdown) => {
			post_data.markdown = markdown
			formatPost(post_data, fn)
		})
	})
}

function sendContent(content, mime, res) {
	res.writeHead(200, mime)
	res.end(content)
}

function logConsole(message) {
    date = new Date()
	const offsetMs = date.getTimezoneOffset() * 60 * 1000
    const msLocal =  date.getTime() - offsetMs
    const dateLocal = new Date(msLocal)
    const iso = dateLocal.toISOString()
    const isoLocal = iso.slice(0, 19).replace('T', ' ')
	console.log(isoLocal, message)
}

const port = 5000
server.listen(port)
logConsole('server running in ' + MODE_STRING + ' mode and listening on port ' + port)