function subPostList(html, hostname, post_list, current_post) {
	const list_regex = /{{posts}}/;
	let post_list_string = "<ul id=\"post_list\">";
	let opacity = 1;
	
	for (let post_name of post_list) {
		if (opacity <= 0) {
			break;
		}
		
		let css = 'class = \"post_list_entry\" ';
		let url = 'http://' + hostname + "/" + post_name;
		let tic = '';

		if (current_post == post_name) {
			css = 'id = \"post_list_current\" ';
			tic = '<span id=\"chevron\">» </span>';
		}

		post_list_string += "<li style=\"opacity: " + opacity + "\">" + tic +
							"<a " + css + "href=" + url + ">" + post_name +
							"</a></li>";
		opacity -= 0.1;
		opacity = opacity.toFixed(1);
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
	return post.replace(paragraph_regex, '<p>$1</p>');
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
	return post.replace(bold_regex, '<strong>$1</strong>');
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
	let footer = "";
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

function subContent(html, metadata, post) {
	let body_text = "<h1 class=\"h1\">" + metadata.title + "</h1>"
	body_text += "<h6 class=\"h6\">" + metadata.tagline + 
				" (tagged as " + metadata.topics.join(', ') + ")</h6>"
	body_text += post
	return html.replace(/{{content}}/, body_text);
}

function addEndMark(post) {
	return post + ' ' + '▣';
}

function stripCarriageReturns(post) {
	return post.replace(/\r/g, '');
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
	post = subContent(post_data.html, post_data.metadata, post);
	post = subPostList(post, post_data.host, post_data.previous_posts, post_data.directory);
	post = subFooter(post, post_data.last_post_url, post_data.next_post_url);
	fn(post);
}

module.exports = {
	formatPost: formatPost,
	subContent: subContent,
	subTitles: subTitles,
	subImages: subImages,
	subOrderedLists: subOrderedLists,
	subUnorderedLists: subUnorderedLists
};