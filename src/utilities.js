const fs = require('fs');
const path = require('path');

// currently unused
function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
  
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function getMetadataFiles(dir, files_) {
	files_ = files_ || [];
	var files = fs.readdirSync(dir);
	for (var i in files){
		var name = dir + '/' + files[i];
		if (fs.statSync(name).isDirectory()) {
			getMetadataFiles(name, files_);
		} else if (name.endsWith('metadata.json')) {
			files_.push(name);
		}
	}
	return files_;
}

function getAllPostsByDate(fn) {
	fs.readdir(path.join(APP_ROOT, 'posts'), (err, files) => {
		if (err) {
			logConsole('error: post list ' + err);
		}
		else {
			// natural sort file names (should be ISO dates!)
			files.sort(function(a, b) {
				return b.localeCompare(a, undefined, {
					numeric: true,
					sensitivity: 'base'
				});
			})
			// drop hidden dir names, alphabetic dir names
			files = files.filter(item=> !/^[A-z\.].*/.test(item));
			fn(files);
		}
	})
}

function sendContent(content, mime, res, code = 200) {
	res.writeHead(code, mime);
	res.end(content);
}

function logConsole(message, req) {
    date = new Date();
	const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    const msLocal =  date.getTime() - offsetMs;
    const dateLocal = new Date(msLocal);
    const iso = dateLocal.toISOString();
    const isoLocal = iso.slice(0, 19).replace('T', ' ');
	let ip = '';
	if (req) {
		ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
        	  req.socket.remoteAddress;
		if (ip == '::ffff:127.0.0.1') {
			ip = 'localhost';
		}
		console.log('[' + isoLocal + '] [' + ip + ']', message);
		
	} else {
		console.log('[' + isoLocal + ']', message);
	}
}

module.exports = {
    getMetadataFiles: getMetadataFiles,
    getAllPostsByDate: getAllPostsByDate,
    logConsole: logConsole,
    sendContent: sendContent
}