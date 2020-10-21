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
	return post.replace(link_regex, ' <a href="$2">$1</a>');
}

function subImages(post) {
	const image_regex = /!\[(.*?)\]\((.+?)\)/g;
	const image_html = '<br><br><img class="center" src="$2" alt="$1"><br>';
	return post.replace(image_regex, image_html);
}

function addParagraphs(post) {
	const paragraph_regex = /(^[A-Za-z].*(?:\n[A-Za-z].*)*)/gm;
	return post.replace(paragraph_regex, '<p>$1</p>');
}

function addRule(post) {
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
	const bold_regex = /\*([^*]+)\*/g;
	return post.replace(bold_regex, '<em>$1</em>');
}

function subBlockQuotes(post) {
	const bold_regex = /^>\s([^\n]+)/gm;
	return post.replace(bold_regex, '<div class="quote">$1</div>');
}

function subPreText(post) {
	const pre_regex = /`([^`]+)`/g;
	return post.replace(pre_regex, '<pre>$1</pre>')
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

function subContent (html, post) {
	let content_regex = /{{content}}/;
	return html.replace(content_regex, post);
}

function formatPost (html, post, lastPost, nextPost, fn) {
	// remove carriage returns
	post = post.replace(/\r/g, '');
	post = subTitles(post);
	post = subLinks(post);
	post = subImages(post);
	post = addParagraphs(post);
	post = addRule(post);
	post = subBoldItalicText(post);
	post = subBoldText(post);
	post = subItalicText(post);
	post = subBlockQuotes(post);
	post = subPreText(post);
	post = subContent(html, post);
	post = subFooter(post, lastPost, nextPost);
	fn(post);
}

module.exports = {
	formatPost: formatPost
};