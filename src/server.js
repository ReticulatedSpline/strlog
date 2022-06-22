const { dir } = require('console')
const fs = require('fs')
const http = require('http')
const path = require('path')
const { formatPost, formatTopic } = require('./format.js')

const CSS_MIME  = { 'Content-Type': 'text/css' }
const HTML_MIME = { 'Content-Type': 'text/html' }
const ICO_MIME  = { 'Content-Type': 'image/x-icon' }
const JPG_MIME  = { 'Content-Type': 'image/jpg' }
const PNG_MIME  = { 'Content-Type': 'image/png' }
const app_root = path.join(__dirname, '../')
const html_path = 'resources/page.html'
const error_path = 'resources/error.html'

const port = process.env.PORT || 5000
//var posts = cacheAllPosts();
//console.log('Loaded', posts.length, 'posts.')

function sortByISODate(a, b) {
	let options = {numeric: true, sensitivity: 'base'}
	return b.localeCompare(a, undefined, options)
}

function cacheAllPosts() {
	let post_dirs = fs.readdirSync(path.join(app_root, 'posts'))
	// natural sort file names (should be ISO dates!)
	post_dirs.sort(sortByISODate)
	// drop hidden dir names, alphabetic dir names
	post_dirs = post_dirs.filter(item=> !/^[A-z\.].*/.test(item))
	let index = 0
	let posts = []
	for (directory in post_dirs) {
		let post = {

		}
		index += 1
		posts.push(post)
	}
	return post_dirs
}

let server = http.createServer(function (req, res) {
	const host = req.headers.host

	if (req.url == '/') {
		routeMostRecentPost(res)
	}
	else if (req.url.match(/\d{4}-\d{2}-\d{2}$/)) {
		routeSpecificPost(host, req.url, res)
	}
	else if (req.url.endsWith('/topics')) {
		routeAllTopics(req, res)
	}
	else if (req.url.match(/\/topics\/[A-z]+$/)) {
		routeSpecificTopic(req, res)
	}
	else if (req.url.endsWith('/about')) {
		routeAbout(req, res)
	}
	else if (req.url.endsWith('/style.css')) {
		let uri = path.join(app_root, 'resources', 'style.css')
		routeCSS(uri, res)
	}
	else if (req.url == '/favicon.ico') {
		let uri = path.join(app_root, 'resources', 'favicon.ico')
		routeImage(uri, ICO_MIME, res)
	}
	else if (req.url == '/icon.png') {
		let uri = path.join(app_root, 'resources', 'icon.png')
		routeImage(uri, PNG_MIME, res)
	}
	else if (req.url.endsWith('.jpg') || req.url.endsWith('.jpeg')) {
		let uri = path.join(app_root, req.url)
		routeImage(uri, JPG_MIME, res)
	}
	else if (req.url.endsWith('.png')) {
		let uri = path.join(app_root, req.url)
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

function routeMostRecentPost(res) {
	console.log('Redirecting to most recent post')
	getAllPostsByDate((files) => {
		res.writeHead(302, {'Location': files[0]})
		res.end()
	})
}

function routeSpecificPost(host, url, res) {
	getAllPostsByDate((files) => {
		// check for matching post
		let post_index = 0
		for (const [index, post] of files.entries()) {
			if (post === url.substring(1)) {
				console.log('Post', post, 'requested')
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

function routeAbout(req, res) {
	console.log('About page requested.')
	fs.readFile('./posts/about/post.md', 'utf8', (err, markdown) => {
		if (err) {
			console.log('Error reading ./posts/about:', error)
			return
		}
		let index = parseInt(Math.random() * 10) + 3
		let post_list = []
		while (index > 0) {
			post_list.push('▒'.repeat(parseInt(Math.random() * 10)))
			index -= 1
		}

		fs.readFile(html_path, 'utf8', (err, html) => {
			let metadata_path = path.join(app_root, './posts/about/metadata.json')
			let page_data = {
				html: html,
				host: req.headers.host,
				directory: 'about',
				markdown: markdown,
				metadata: require(metadata_path),
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
	console.log('Invalid route ' + req.url)
	fs.readFile(error_path, 'utf8', (err, html) => {
		sendContent(html, HTML_MIME, res)
	})
}

function getAllPostsByDate(fn) {
	fs.readdir(path.join(app_root, 'posts'), (err, files) => {
		if (err) {
			console.log('Error fetching files: ', err)
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

function routeSpecificTopic(req, res) {
	let topics = {}
	let current_topic = {}
	let url_parts = req.url.split('/')
	let topic_name = url_parts[url_parts.length - 1]
	console.log('Requested topic', topic_name)
	for (file of getMetadataFiles('./posts')) {
		metadata = require(path.join(app_root, file))
		for (topic of metadata.topics) {
			// gross hack to grab the date string out of the path :(
			let directory = file.split('/')[2]
			let item = {
				title: metadata.title,
				tagline: metadata.tagline,
				url: path.join(req.headers.host, directory)
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

	buildTopicResponse(req, res, topics, current_topic)
}

function routeAllTopics(req, res) {
	let topics = {}
	let current_topic = {}
	console.log('Topic list requested')
	for (file of getMetadataFiles('./posts')) {
		metadata = require(path.join(app_root, file))
		for (topic of metadata.topics) {
			// gross hack to grab the date string out of the path :(
			let directory = file.split('/')[2]
			let url = path.join(req.headers.host, directory)
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

	buildTopicResponse(req, res, topics, current_topic)
}

function buildTopicResponse(req, res, topics, current_topic) {
	fs.readFile(html_path, 'utf8', (err, html) => {
		page_data = {
			html: html,
			host: req.headers.host,
			topics: topics,
			current_topic: current_topic,
			current_tab: 'topics'
		}
		let fn = (postContent) => {sendContent(postContent, HTML_MIME, res)}
		formatTopic(page_data, fn)
	})
}

function buildPostResponse(host, post_dir, previous_posts, next_post, last_post, fn) {
	const metadata_path = path.join(app_root, './posts', post_dir, 'metadata.json')
	const markdown_path = path.join(app_root, './posts', post_dir, 'post.md')

	let post_data = {
		host: host,
		directory: post_dir,
		previous_posts: previous_posts,
		last_post_url: last_post,
		next_post_url: next_post,
		html_dir: html_path,
		metadata: require(metadata_path),
		current_tab: 'posts'
	}

	fs.readFile(html_path, 'utf8', (err, html) => {
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

server.listen(port)
console.log('Server online and listening at port ' + port)