const ansi_red_blink = "\x1b[5m\x1b[41m";
const ansi_green = "\x1b[42m";

let passed = 0;
let failed = 0;

// tested modules
const format = require('../src/format.js');

// unit tests
function testSubContent() {
	let content = 'hello world';
	let html = '<html><body>{{content}}</body></html>';
	let actual = format.subContent(html, content);
	let expected = '<html><body>hello world</body></html>';
	runTest(testSubContent, expected, actual);
}

function testSubTitles() {
	let post = '# title';
	let actual = format.subTitles(post);
	let expected = '<h1>title</h1>';
	runTest(testSubTitles, expected, actual);
}

// testing framework
tests = [
	testSubContent,
	testSubTitles,
]

function stripWhitespace(text) {
	return text.replace(/\s+/g,'');
}

function runTest(test, expected, actual) {
	// should whitespace be stripped in all cases?
	expected = stripWhitespace(expected);
	actual = stripWhitespace(actual);
	if (expected === actual) {
		passed++;
		console.log('\t' + test.name + ' passed.');
		return true;
	}
	else {
		failed++;
		console.log('\t' + test.name + ' failed.');
		console.log('\t\tExpected: ' + expected + '\n\t\tActual:    ' + actual);
		return false;
	}
}

for (let test of tests) {
	test();
}

let color = failed ? ansi_red_blink : ansi_green;
console.log(color, "Tests complete. " + passed + " passed, " + failed + " failed.")