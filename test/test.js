const ansi_red_blink = "\x1b[5m\x1b[41m";
const ansi_green = "\x1b[42m";

let passed = 0;
let failed = 0;

const format = require('./format.js');

tests = [
	contentReplace,
]

for (let test of tests) {
	if (test()) {
		passed++;
	}
	else {
		failed++;
	}
}

function contentReplace() {
	let html = '<html><body>{{content}}';
}

let color = failed ? ansi_red_blink : ansi_green;
console.log(color, "Tests complete. " + passed + " passed, " + failed + " failed.")