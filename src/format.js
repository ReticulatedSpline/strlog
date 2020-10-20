function subTitles(post) {
	let title_regex = /^#{1}\s(.+)/gm;
	post = post.replace(title_regex, '<h1>$1</h1>\n');
	title_regex = /^#{2}\s(.+)/gm;
	post = post.replace(title_regex, '<h2>$1</h2>\n');
	title_regex = /^#{3}\s(.+)/gm;
	post = post.replace(title_regex, '<h3>$1</h3>\n');
	title_regex = /^#{4}\s(.+)/gm;
	post = post.replace(title_regex, '<h4>$1</h4>\n');
	title_regex = /^#{5}\s(.+)/gm;
	post = post.replace(title_regex, '<h5>$1</h5>\n');
	title_regex = /^#{6}\s(.+)/gm;
	return post.replace(title_regex, '<h6>$1</h6>\n');
}

function subLinks(post) {
	let link_regex = /[^!]\[(.+?)\]\((.+?)\)/g;
	return post.replace(link_regex, ' <a href="$2">$1</a>');
}

function subImages(post) {
	let image_regex = /!\[(.*?)\]\((.+?)\)/g;
	let image_html = '<br><br><img class="center" src="$2" alt="$1"><br>';
	return post.replace(image_regex, image_html);
}

function addParagraphs(post) {
	let paragraph_regex = /(^[A-Za-z].*(?:\n[A-Za-z].*)*)/gm;
	return post.replace(paragraph_regex, '<p>$1</p>')
}

function subFooter(post, lastPost, nextPost) {
	let footer_regex = /{{footer}}/;
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
	post = subTitles(post);
	post = subLinks(post);
	post = subImages(post);
	post = addParagraphs(post);
	post = subFooter(post, lastPost, nextPost);
	post = subContent(html, post);
	fn(post);
}

module.exports = {
	formatPost: formatPost
};