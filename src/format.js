function subPostList(post, host, post_list) {
	const list_regex = /{{posts}}/;
	const post_list_reversed = post_list.reverse();
	let post_list_string = "<ul id=\"post_list\">";
	let opacity = 1;
	for (let post_title of post_list_reversed) {
		if (opacity <= 0) {
			break;
		}
		post_list_string += "<li style=\"opacity: " + opacity + "\">" + 
		"<a class=\"post_list_entry\" href=http://" +
		host + "/" + post_title + ">" + post_title + "</a></li>";
		opacity -= 0.1;
		opacity = opacity.toFixed(1);
	}
	post_list_string += "</ul>";

	return post.replace(list_regex, post_list_string);
}

function subTitles(post) {
	post = post.replace(/^#{1}\s(.+)/gm, '<h1>$1</h1>\n');
	post = post.replace(/^#{2}\s(.+)/gm, '<h2>$1</h2>\n');
	post = post.replace(/^#{3}\s(.+)/gm, '<h3>$1</h3>\n');
	post = post.replace(/^#{4}\s(.+)/gm, '<h4>$1</h4>\n');
	post = post.replace(/^#{5}\s(.+)/gm, '<h5>$1</h5>\n');
	return post.replace(/^#{6}\s(.+)/gm, '<h6>$1</h6>\n');
}

function subLinks(post) {
	const link_regex = /[^!]\[(.+?)\]\((.+?)\)/g;
	return post.replace(link_regex, ' <a class=\"body_link\" href="$2" target="_blank">$1</a>');
}

function subImages(post, date) {
	const image_regex = /!\[(.*?)\]\((.+?)\)/g;
	const image_html =
	'<div class="body_photo_div">' +
	'<img class="body_photo" src="' + './posts/' + date + '/$2" alt="$1">' +
	'<p class="body_alt_text">*$1*</p></div>';
	return post.replace(image_regex, image_html);
}

function addParagraphs(post) {
	const paragraph_regex = /(^[A-Za-z].*(?:\n[A-Za-z].*)*)/gm;
	return post.replace(paragraph_regex, '<p>$1</p>');
}

function subRulers(post) {
	const rule_regex = /\n---\n/g;
	return post.replace(rule_regex, '\n<hr>\n');
}

function subBoldItalicText(post) {
	const bold_italic_regex = /\*\*\*([^*]+)\*\*\*/g;
	return post.replace(bold_italic_regex, '<strong><em>$1</em></strong>');
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
	post = post.replace(fence_regex, '<pre>$1</pre>')
	return post.replace(pre_regex, '<pre>$1</pre>')
}

function subUnorderedLists(post) {
	const list_shell_regex = /((?:\n-\s.*)+)/gm;
	const list_item_regex = /\n-\s([^\n]+)/m;
	post = post.replace(list_shell_regex, '\n<ul class=\"body_list\>\n$1\n</ul>');
	while (results = post.match(list_item_regex)) {
		post = post.replace(list_item_regex, '\n<li>$1</li>')
	}
	return post;
}

function subOrderedLists(post) {
	const list_shell_regex = /((?:\n\d\.\s.*)+)/gm;
	const list_item_regex = /\n\d\.\s([^\n]+)/m;
	post = post.replace(list_shell_regex, '<ol class=\"body_list\">\n$1\n</ol>');
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


function subContent (html, post, date) {
	html = html.replace(/{{date}}/, '<h3>' + date + '</h3>');
	return html.replace(/{{content}}/, post);
}

function addEndMark(post) {
	return post + ' ' + '▣';
}

function stripCarriageReturns(post) {
	return post.replace(/\r/g, '');
}

function formatPost (html, host, post, date, lastPost, nextPost, post_list, fn) {
	post = stripCarriageReturns(post);
	post = subTitles(post);
	post = subLinks(post);
	post = subImages(post, date);
	post = subPreText(post);
	post = addEndMark(post);
	post = addParagraphs(post);
	post = subBoldItalicText(post);
	post = subBoldText(post);
	post = subItalicText(post);
	post = subBlockQuotes(post);
	post = subUnorderedLists(post);
	post = subOrderedLists(post);
	post = subRulers(post);
	post = subContent(html, post, date);
	post = subPostList(post, host, post_list);
	post = subFooter(post, lastPost, nextPost);
	fn(post);
}

module.exports = {
	formatPost: formatPost
};