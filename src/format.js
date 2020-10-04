function formatPost (html, post) {
	let content_regex = /{{content}}/;
	post = html.replace(content_regex, post);
	let title_regex = /#\s(.+)/g;
	post = post.replace(title_regex, '<h1>$1</h1>');
	let link_regex = /[^!]\[(.+?)\]\((.+?)\)/g;
	post = post.replace(link_regex, ' <a href="$2">$1</a>');
	let image_regex = /!\[(.*?)\]\((.+?)\)/g;
	post = post.replace(image_regex, '<br><br><img class="center" src="$2" alt="$1"><br>');
	return post;
}

module.exports.formatPost = formatPost;