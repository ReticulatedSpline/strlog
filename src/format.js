function subContent (html, post) {
	let content_regex = /{{content}}/;
	return html.replace(content_regex, post);
}

function subTitles(post) {
	let title_regex = /#\s(.+)/g;
	return post.replace(title_regex, '<h1>$1</h1>');
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

function formatPost (html, post, lastPost, nextPost, fn) {
	post = subContent(html, post);
	post = subTitles(post);
	post = subLinks(post);
	post = subImages(post);
	post = subFooter(post, lastPost, nextPost);
	fn(post);
}

module.exports = {
	formatPost: formatPost
};