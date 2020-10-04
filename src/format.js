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

function formatPost (html, post) {
	post = subContent(html, post);
	post = subTitles(post)
	post = subLinks(post)
	post = subImages(post)
	return post;
}

module.exports = {
	subContent: subContent,
	subTitles: subTitles,
	subLinks: subLinks,
	subImages: subImages,
	formatPost: formatPost,
};