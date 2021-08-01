const format = require('../src/format.js');
const ansi_red_blink = "\x1b[5m\x1b[41m";
const ansi_green = "\x1b[42m";
const ansi_reset = "\x1b[0m";

let passed = 0;
let failed = 0;
let date = '1996-12-27'

// unit tests
function testSubContent() {
	let content = 'hello world';
	let html = '<html><body>{{content}}</body></html>';
	let actual = format.subContent(html, content, date);
	let expected = '<html><body>hello world</body></html>';
	runTest(testSubContent, expected, actual);
}

function testSubTitles() {
	let post = '# title';
	let actual = format.subTitles(post);
	let expected = '<h1>title</h1>\n';
	runTest(testSubTitles, expected, actual);
}

function testSubImages() {
	let post = '![a test alt text](image.png)';
	let actual = format.subImages(post, date);
	let expected = 	'<div class="body_photo_div">' +
					'<img class="body_photo" ' +
					'src=\"./posts/1996-12-27/image.png\" ' +
					'alt=\"a test alt text\">' +
					'<p class=\"body_alt_text\">*a test alt text*</p></div>';
	runTest(testSubImages, expected, actual);
}

function testSubUnorderedLists() {
	let post = '\n- item 1\n- item 2\n- item 3';
	let actual = format.subUnorderedLists(post);
	let expected = '\n<ul>\n<li>item 1</li>\n<li>item 2</li>\n<li>item 3</li>\n</ul>';
	runTest(testSubUnorderedLists, expected, actual);
}

function testSubOrderedLists() {
	let post = '\n1. item 1\n2. item 2\n3. item 3';
	let actual = format.subOrderedLists(post);
	let expected = '\n<ol>\n<li>item 1</li>\n<li>item 2</li>\n<li>item 3</li>\n</ol>';
	runTest(testSubUnorderedLists, expected, actual);
}

// testing framework
tests = [
	testSubContent,
	testSubTitles,
	testSubImages,
	testSubOrderedLists,
	testSubUnorderedLists,
]

function runTest(test, expected, actual) {
	if (expected === actual) {
		passed++;
		//console.log('\t' + test.name + ' passed.');
		return true;
	}
	else {
		failed++;
		console.log('\t' + test.name + ' failed.');
		console.log('\t\tExpected: ' + expected + '\n\t\tActual:   ' + actual);
		return false;
	}
}

for (let test of tests) {
	test();
}

let color = failed ? ansi_red_blink : ansi_green;
console.log(color, "Tests complete. " + passed + " passed, " + failed + " failed." + ansi_reset)