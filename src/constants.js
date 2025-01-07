const path = require('path')
global.CSS_MIME  = { 'Content-Type': 'text/css' }
global.HTML_MIME = { 'Content-Type': 'text/html' }
global.ICO_MIME  = { 'Content-Type': 'image/x-icon' }
global.JPG_MIME  = { 'Content-Type': 'image/jpg' }
global.PNG_MIME  = { 'Content-Type': 'image/png' }
global.APP_ROOT = path.join(__dirname, '../')
global.HTML_PATH = 'resources/page.html'
global.ERROR_PATH = 'resources/error.html'
global.IS_PROD = process.argv[2] == 'prod' ? true : false;
global.MODE_STRING =  IS_PROD ? 'production' : 'local'