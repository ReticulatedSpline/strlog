function insertContent(page_data) {
	
	if (!page_data || !page_data.metadata) {
		page_data = {};
		page_data['metadata'] = {};
		page_data['html'] = '<html><body>{{content}}</body></html>';
		page_data.metadata['title'] = '';
		page_data.metadata['tagline'] = '';
		page_data.metadata['topics'] = [];
	}

	let body_text = '<div id="content">'
		+ '<h1 class="h1">'+ page_data.metadata.title + '</h1>'
		+ '<div class="subtitle">'
		+ '<span class="tagline">' + page_data.metadata.tagline
		+ '</span><div class="topic_tags">';
	
	for (topic of page_data.metadata.topics) {
		let url = page_data.host + '/topics/' + topic;
		body_text += '<a href="http://' + url + '" class="topic_tag">'
				  + topic + '</a>';
	}

	body_text += '</div></div>';
	body_text += page_data.markdown + '</div>';
	
	page_data.html = page_data.html.replace(/{{tagline}}/, '"'
		+ page_data.metadata.tagline + '"');
	
	page_data.html = page_data.html.replace(/{{title}}/, '"strlog: '
	+ page_data.metadata.title + '"');

	page_data.html = page_data.html.replace(/{{content}}/, body_text);
}

function insertNavbar(page_data, make_translucent) {
	const list_regex = /{{navbar}}/;
	let post_list_string = '<ul id="navbar">';
	let opacity = 1;

	for (let post_name of page_data.previous_posts) {
		if (opacity <= 0) {
			break;
		}
		
		let css = 'class = "tab';
		let url = 'http://' + page_data.host + '/' + post_name;

		if (page_data.no_url) {
			url = '';
		}

		if (page_data.directory == post_name) {
			css += ' current_tab"';
		} else {
			css += '"';
		}

		post_list_string += '<li style="opacity: ' + opacity + '">' +
							'<a ' + css + 'href="' + url + '">' + post_name +
							'</a></li>';

		if (make_translucent) {
			opacity -= 0.1;
			opacity = opacity.toFixed(1);
		}
	}

	post_list_string += '</ul>';
	page_data.html = page_data.html.replace(list_regex, post_list_string);
}

function subTitles(page_data) {
	let markdown = page_data.markdown;
	markdown = markdown.replace(/^#{1}\s(.+)/gm, '<h1 class=\"h1\">$1</h1>\n');
	markdown = markdown.replace(/^#{2}\s(.+)/gm, '<h2 class=\"h2\">$1</h2>\n');
	markdown = markdown.replace(/^#{3}\s(.+)/gm, '<h3 class=\"h3\">$1</h3>\n');
	markdown = markdown.replace(/^#{4}\s(.+)/gm, '<h4 class=\"h4\">$1</h4>\n');
	markdown = markdown.replace(/^#{5}\s(.+)/gm, '<h5 class=\"h5\">$1</h5>\n');
	markdown = markdown.replace(/^#{6}\s(.+)/gm, '<h6 class=\"h6\">$1</h6>\n');
	page_data.markdown = markdown;
}

function subLinks(page_data) {
	const link_regex = /[^!]\[(.+?)\]\((.+?)\)/g;
	page_data.markdown = page_data.markdown
		.replace(link_regex, ' <a class="link body_link" href="$2" target="_blank">$1</a>');
}

function subImages(page_data) {
	const image_regex = /!\[(.*?)\]\((.+?)\)/g;
	const image_html =
	'<div class="center body_photo_div">' +
	'<img class="body_photo" src="' + page_data.directory + '/$2" alt="$1">' +
	'<p class="p body_alt_text">$1</p></div>';
	page_data.markdown = page_data.markdown.replace(image_regex, image_html);
}

function addParagraphs(page_data) {
	const paragraph_regex = /(^[A-Za-z¿¡].*(?:\n[A-Za-z].*)*)/gm
	page_data.markdown = page_data.markdown.replace(paragraph_regex, '<p class="p">$1</p>')
}

function subRulers(page_data) {
	const rule_regex = /\n---\n/g
	page_data.markdown = page_data.markdown.replace(rule_regex, '\n<hr class="hr">\n')
}

function subStrikeText(page_data) {
	const strike_regex = /~~([^~]+?)~~/g
	page_data.markdown = page_data.markdown.replace(strike_regex,
		'<span style="text-decoration: line-through">$1</span>')
}

function subBoldItalicText(page_data) {
	const bold_italic_regex = /\*\*\*([^*]+)\*\*\*/g;
	page_data.markdown = page_data.markdown
		.replace(bold_italic_regex, '<strong class="strong"><em>$1</em></strong>');
}

function subTitleTextEffects(page_data) {
	const bold_italic_regex = /\*\*\*([^*]+)\*\*\*/g;
	const bold_regex = /\*\*([^*]+)\*\*/g;
	const italic_regex1 = /\*([^*]+)\*/g;
	for (item of page_data.card_list) {
		item.title = item.title
			.replace(bold_italic_regex, '<strong class="strong"><em>$1</em></strong>');
		item.title = item.title
			.replace(bold_regex, '<strong class="strong">$1</strong>');
		item.title = item.title
			.replace(italic_regex1, '<em>$1</em>');
	}
}

function subBoldText(page_data) {
	const bold_regex = /\*\*([^*]+)\*\*/g;
	page_data.markdown = page_data.markdown
		.replace(bold_regex, '<strong class="strong">$1</strong>');
}

function subItalicText(page_data) {
	const italic_regex1 = /\*([^*]+)\*/g;
	const italic_regex2 = /\_([^_.]+)\_/g;
	//post = post.replace(italic_regex1, '<em>$1</em>');
	page_data.markdown = page_data.markdown.replace(italic_regex1, '<em>$1</em>');
}

function subBlockQuotes(page_data) {
	const bold_regex = /^>\s([^\n]+)/gm
	page_data.markdown = page_data.markdown.replace(bold_regex, '<p class="p quote">$1</p>')
}

function subPreText(page_data) {
	// can't use backticks in code blocks with this regex
	const pre_regex = /`([^`]+)`/g;
	const fence_regex = /```([^`]+)```/gm;
	page_data.markdown = page_data.markdown.replace(fence_regex, '<pre class="p pre">$1</pre>');
	page_data.markdown = page_data.markdown.replace(pre_regex, '<pre class="p pre">$1</pre>');
}

function subUnorderedLists(page_data) {
	const list_shell_regex = /((?:\n-\s.*)+)/gm;
	const list_item_regex = /\n-\s([^\n]+)/m;
	
	page_data.markdown = page_data.markdown
		.replace(list_shell_regex, '\n<ul class="p ul">$1\n</ul>');
	
	while (results = page_data.markdown.match(list_item_regex)) {
		page_data.markdown = page_data.markdown.replace(list_item_regex, '\n<li>$1</li>');
	}
}

function subOrderedLists(page_data) {
	const list_container_regex = /((?:\n\d\.\s.*)+)/gm;
	const list_item_regex = /\n\d\.\s([^\n]+)/gm;
	
	page_data.markdown = page_data.markdown
		.replaceAll(list_container_regex, '\n<ol class="p">$1\n</ol>');
	
	page_data.markdown = page_data.markdown
		.replaceAll(list_item_regex, '\n<li>$1</li>');
}

function insertFooter(page_data) {
	const footer_regex = /{{footer}}/

	if (!page_data.last_post && !page_data.next_post) {
		page_data.html = page_data.html.replace(footer_regex, '');
		return;
	}

	let footer = '<hr class="hr"/>'
	if (page_data.last_post) {
		footer = '<a id="last" href="' + page_data.last_post + '">last</a>'
	} else {
		footer = '<span class="grey" id="last">//last</span>'
	}

	if (page_data.next_post) {
		footer = footer + '<a id="next" href="' + page_data.next_post + '">next</a>'
	} else {
		footer = footer + '<span class="grey" id="next">//next</span>'
	}

	page_data.html = page_data.html.replace(footer_regex, footer)
}

function addEndMark(page_data) {
	page_data.markdown = page_data.markdown + ' ▣';
}

function stripCarriageReturns(page_data) {
	page_data.markdown = page_data.markdown.replace(/\r/g, '')
}

function insertHeader(post_data) {
	let header = '<ul id="main_menu">';
	let tabs = ['posts', 'topics', 'about'];
	let urls = ['/posts', '/topics', '/about'];
	let index = 0;
	while (index < 3) {
		header += '<li>';
		if (post_data.current_tab == tabs[index]) {
			header += '<a class="h1 tab current_tab" ';
		} else {
			header += '<a class="h1 tab" ';
		}
		header += 'href="' + urls[index] + '">';
		header += tabs[index] + '</a></li>';
		index += 1;
	}
	header += "</ul>";
	post_data.html = post_data.html.replace(/{{header}}/, header);
}

function insertHyperlinkList(page_data) {
	let content = '<div id="content">'
	for (let item of page_data.card_list) {
		content += '<h2 class = "h2">'
		content += '<a class = "link body_link" href="http://' + item.url + '"/>'
		content += item.title
		content += '</a></h2>'
		if (item.tagline) {
			content += '<h3 class = "tagline">'
			content += item.tagline
			content += '</h3>'
		}
	}
	content += '</div>'
	page_data.html = page_data.html.replace(/{{content}}/, content)
}

function insertTopicNavbar(page_data) {
	let navbar_string = '<ul id=\"navbar\">'
	for (topic in page_data.topics) {
		let css = 'class = "tab'
		let url = 'http://' + page_data.host + '/topics/' + topic

		if (page_data.current_topic == topic) {
			css += ' current_tab"'
		} else {
			css += '"'
		}

		navbar_string += '<li><a ' + css + 'href="' + url + '">' + topic +'</a></li>'
	}

	navbar_string += '</ul>'
	page_data.html = page_data.html.replace(/{{navbar}}/, navbar_string)
}

function formatPost(page_data, fn) {

	// markdown regexes (modifying state of page_data.markdown)
	stripCarriageReturns(page_data);
	subTitles(page_data);
	subLinks(page_data);
	subImages(page_data);
	subPreText(page_data);
	addEndMark(page_data);
	addParagraphs(page_data);
	subBoldItalicText(page_data);
	subBoldText(page_data);
	subStrikeText(page_data);
	subItalicText(page_data);
	subBlockQuotes(page_data);
	subUnorderedLists(page_data);
	subOrderedLists(page_data);
	subRulers(page_data);
	
	// html (modifying state of page_data.html)
	insertContent(page_data);
	insertNavbar(page_data, true);
	insertHeader(page_data);
	insertFooter(page_data);

	// callback
	fn(page_data.html)
}

function formatHyperlinkList(page_data, fn) {
	insertHeader(page_data)
	subTitleTextEffects(page_data)
	insertHyperlinkList(page_data)
	insertFooter(page_data)
	insertTopicNavbar(page_data)
	fn(page_data.html)
}

function formatModal(page_data, fn) {
	// TODO
	fn(page_data)
}

module.exports = {
	formatModal: formatModal,
	formatHyperlinkList: formatHyperlinkList,
	formatPost: formatPost
}