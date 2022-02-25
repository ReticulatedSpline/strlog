function subSidebar(html, post_data, make_translucent) {
	const list_regex = /{{sidebar}}/
	const hostname = post_data.host
	const post_list = post_data.previous_posts
	const current_post = post_data.directory
	let post_list_string = "<ul id=\"sidebar\">"
	let opacity = 1
	
	for (let post_name of post_list) {
		if (opacity <= 0) {
			break;
		}
		
		let css = 'class = "sidebar_entry"';
		let url = 'http://' + hostname + "/" + post_name;

		if (current_post == post_name) {
			css += ' id = \"sidebar_current\" ';
		}

		post_list_string += "<li style=\"opacity: " + opacity + "\">" +
							"<a " + css + "href=" + url + ">" + post_name +
							"</a></li>";

		if (make_translucent) {
			opacity -= 0.1;
			opacity = opacity.toFixed(1);
		}
	}

	post_list_string += "</ul>";
	return html.replace(list_regex, post_list_string);
}

function subTitles(post) {
	post = post.replace(/^#{1}\s(.+)/gm, '<h1 class=\"h1\">$1</h1>\n');
	post = post.replace(/^#{2}\s(.+)/gm, '<h2 class=\"h2\">$1</h2>\n');
	post = post.replace(/^#{3}\s(.+)/gm, '<h3 class=\"h3\">$1</h3>\n');
	post = post.replace(/^#{4}\s(.+)/gm, '<h4 class=\"h4\">$1</h4>\n');
	post = post.replace(/^#{5}\s(.+)/gm, '<h5 class=\"h5\">$1</h5>\n');
	return post.replace(/^#{6}\s(.+)/gm, '<h6 class=\"h6\">$1</h6>\n');
}

function subLinks(post) {
	const link_regex = /[^!]\[(.+?)\]\((.+?)\)/g;
	return post.replace(link_regex, ' <a class=\"link body_link\" href="$2" target="_blank">$1</a>');
}

function subImages(post, date) {
	const image_regex = /!\[(.*?)\]\((.+?)\)/g;
	const image_html =
	'<div class="body_photo_div">' +
	'<img class="body_photo" src="' + './posts/' + date + '/$2" alt="$1">' +
	'<p class="body_alt_text">$1</p></div>';
	return post.replace(image_regex, image_html);
}

function addParagraphs(post) {
	const paragraph_regex = /(^[A-Za-z¿¡].*(?:\n[A-Za-z].*)*)/gm;
	return post.replace(paragraph_regex, '<p class=\"p\">$1</p>');
}

function subRulers(post) {
	const rule_regex = /\n---\n/g;
	return post.replace(rule_regex, '\n<hr class=\"hr\">\n');
}

function subStrikeTest(post) {
	const strike_regex = /~~([^~]+?)~~/g;
	return post.replace(strike_regex,
		'<span style="text-decoration: line-through;">$1</span>');
}

function subBoldItalicText(post) {
	const bold_italic_regex = /\*\*\*([^*]+)\*\*\*/g;
	return post.replace(bold_italic_regex, '<strong class=\"strong\"><em>$1</em></strong>');
}

function subBoldText(post) {
	const bold_regex = /\*\*([^*]+)\*\*/g;
	return post.replace(bold_regex, '<strong class=\"strong\">$1</strong>');
}

function subItalicText(post) {
	const italic_regex1 = /\*([^*]+)\*/g;
	const italic_regex2 = /\_([^_.]+)\_/g;
	//post = post.replace(italic_regex1, '<em>$1</em>');
	return post.replace(italic_regex1, '<em>$1</em>');
}

function subBlockQuotes(post) {
	const bold_regex = /^>\s([^\n]+)/gm;
	return post.replace(bold_regex, '<p class="quote">$1</p>');
}

function subPreText(post) {
	// can't use backticks in code blocks with this regex
	const pre_regex = /`([^`]+)`/g;
	const fence_regex = /```([^`]+)```/gm
	post = post.replace(fence_regex, '<pre class=\"pre\">$1</pre>')
	return post.replace(pre_regex, '<pre class=\"pre\">$1</pre>')
}

function subUnorderedLists(post) {
	const list_shell_regex = /((?:\n-\s.*)+)/gm;
	const list_item_regex = /\n-\s([^\n]+)/m;
	post = post.replace(list_shell_regex, '\n<ul class=\"ul\">$1\n</ul>');
	while (results = post.match(list_item_regex)) {
		post = post.replace(list_item_regex, '\n<li>$1</li>')
	}
	return post;
}

function subOrderedLists(post) {
	const list_shell_regex = /((?:\n\d\.\s.*)+)/gm;
	const list_item_regex = /\n\d\.\s([^\n]+)/m;
	post = post.replace(list_shell_regex, '\n<ol>$1\n</ol>');
		while (results = post.match(list_item_regex)) {
		post = post.replace(list_item_regex, '\n<li>$1</li>')
	}
	return post;
}

function subFooter(post, lastPost, nextPost) {
	const footer_regex = /{{footer}}/;

	if (!lastPost || !nextPost) {
		return post.replace(footer_regex, '');
	}

	let footer = '<hr class="hr"/>';
	if (lastPost) {
		footer = '<a id="last" href=' + lastPost + '>last</a>';
	} else {
		footer = '<span class="grey" id="last">//last</span>';
	}

	if (nextPost) {
		footer = footer + '<a id="next" href=' + nextPost + '>next</a>';
	} else {
		footer = footer + '<span class="grey" id="next">//next</span>';
	}

	return post.replace(footer_regex, footer);
}

function subContent(post, post_data) {
	let body_text = '<div id="content">'
		+ '<h1 class=\"h1\">'+ post_data.metadata.title + '</h1>'
		+ "<div class=\"subtitle\">"
		+ "<span class=\"p tagline\">" + post_data.metadata.tagline
		+ "</span><div>"
	for (topic of post_data.metadata.topics) {
		let url = post_data.host + '/topics/' + topic
		body_text += "<a href=\"" + url + "\" class=\"topics\">"
				  + topic + "</a>"
	}
	body_text += "</div></div>"
	body_text += post + '</div>'
	return post_data.html.replace(/{{content}}/, body_text);
}

function addEndMark(post) {
	return post + ' ▣';
}

function stripCarriageReturns(post) {
	return post.replace(/\r/g, '');
}

function subHeader(post, post_data) {
	let header = '<ul id="main_menu">'
	let tabs = ['recent', 'topics', 'about']
	let urls = ['/', '/topics', '/about']
	let index = 0
	while (index < 3) {
		if (post_data.current_tab == tabs[index]) {
			header += '<li class="h1 strong current_tab">'
		} else {
			header += '<li class="h1 strong">'
		}
		header += '<a href="' + urls[index] + '">'
		header += tabs[index] + '</a></li>'
		header += '</a></li>'
		index += 1
	}
	return post.replace(/{{header}}/, header)
}

function formatPost (post_data, fn) {
	let post = post_data.markdown;
	post = stripCarriageReturns(post);
	post = subTitles(post);
	post = subLinks(post);
	post = subImages(post, post_data.directory);
	post = subPreText(post);
	post = addEndMark(post);
	post = addParagraphs(post);
	post = subBoldItalicText(post);
	post = subBoldText(post);
	post = subStrikeTest(post);
	post = subItalicText(post);
	post = subBlockQuotes(post);
	post = subUnorderedLists(post);
	post = subOrderedLists(post);
	post = subRulers(post);
	post = subContent(post, post_data);
	post = subSidebar(post, post_data, true);
	post = subHeader(post, post_data)
	post = subFooter(post, post_data.last_post_url, post_data.next_post_url);
	fn(post);
}

function concatTitles(page_data) {
	let content = '<div id="content">'
	for (let item of page_data.topics[page_data.current_topic]) {
		content += '<h2 class = "h2">'
		content += '<a class = "link body_link" href="http://' + item.url + '"/>'
		content += item.title
		content += '</a></h2>'
		content += '<h3 class = "tagline">'
		content += item.tagline
		content += '</h3>'
		content += '</br>'
	}
	content += "</div>"

	page_data.html = page_data.html.replace(/{{content}}/, content);
}

function subTopicSidebar(page_data) {
	let sidebar_string = "<ul id=\"sidebar\">"

	for (topic in page_data.topics) {
		let css = 'class = \"sidebar_entry\" '
		let url = 'topics/' + topic
		if (page_data.current_topic == topic) {
			css += 'id = \"sidebar_current\" '
		}

		sidebar_string += "<li><a " + css + 'href="' + url + '">' + topic +"</a></li>";
	}

	sidebar_string += "</ul>";
	return page_data.html.replace(/{{sidebar}}/, sidebar_string);
}

function formatTopic(page_data, fn) {
	concatTitles(page_data);
	page_data.html = subHeader(page_data.html, page_data)
	page_data.html = subFooter(page_data.html, null, null)
	page_data.html = subTopicSidebar(page_data);
	fn(page_data.html);
}

module.exports = {
	formatPost: formatPost,
	formatTopic: formatTopic
};