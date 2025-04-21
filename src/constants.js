const path = require('path');

global.APP_ROOT = path.join(__dirname, '../');
global.HTML_PATH = path.join(APP_ROOT, '/resources/page.html');
global.ERROR_PATH = path.join(APP_ROOT, '/resources/error.html');
global.IS_PROD = process.argv[2] == 'prod' ? true : false;
global.MODE_STRING =  IS_PROD ? 'production' : 'local';

global.CSS_MIME  = { 'Content-Type': 'text/css' };
global.HTML_MIME = { 'Content-Type': 'text/html' };
global.ICO_MIME  = { 'Content-Type': 'image/x-icon' };
global.JPG_MIME  = { 'Content-Type': 'image/jpg' };
global.PNG_MIME  = { 'Content-Type': 'image/png' };
global.TXT_MIME  = { 'Content-Type': 'text/plain'}
global.WOFF2_MIME= { 'Content-Type': 'font/woff2' };

global.WIKI_LINKS = [
    "https://en.wikipedia.org/wiki/Mono_no_aware",
    "https://en.wikipedia.org/wiki/MOSFET",
    "https://en.wikipedia.org/wiki/Bell_Labs",
    "https://en.wikipedia.org/wiki/Semiotics",
    "https://en.wikipedia.org/wiki/John_von_Neumann",
    "https://en.wikipedia.org/wiki/Grace_Hopper",
    "https://en.wikipedia.org/wiki/Operation_Condor",
    "https://en.wikipedia.org/wiki/Thomas_Sankara",
    "https://en.wikipedia.org/wiki/Stories_of_Your_Life_and_Others",
    "https://en.wikipedia.org/wiki/PARC_(company)",
    "https://en.wikipedia.org/wiki/Kerckhoffs%27s_principle",
    "https://en.wikipedia.org/wiki/Stars_in_My_Pocket_Like_Grains_of_Sand",
    "https://en.wikipedia.org/wiki/Operation_Gladio",
    "https://en.wikipedia.org/wiki/Noam_Chomsky",
    "https://en.wikipedia.org/wiki/Fred_Hampton",
    "https://en.wikipedia.org/wiki/The_Bell_Jar",
    "https://en.wikipedia.org/wiki/McKinsey_%26_Company#Controversies",
    "https://en.wikipedia.org/wiki/Near_and_far_field",
    "https://en.wikipedia.org/wiki/Skywave",
    "https://en.wikipedia.org/wiki/Quantum_annealing",
    "https://en.wikipedia.org/wiki/Spin_glass",
    "https://en.wikipedia.org/wiki/Hopfield_network",
    "https://en.wikipedia.org/wiki/Subitizing",
    "https://en.wikipedia.org/wiki/Project_West_Ford",
    "https://en.wikipedia.org/wiki/Vela_incident",
    "https://en.wikipedia.org/wiki/Arecibo_Observatory",
    "https://en.wikipedia.org/wiki/Underwater_habitat",
    "https://en.wikipedia.org/wiki/Flynn%27s_taxonomy",
    "https://en.wikipedia.org/wiki/Ishikawa_diagram",
    "https://en.wikipedia.org/wiki/Failure_mode_and_effects_analysis",
    "https://en.wikipedia.org/wiki/Huffman_coding",
    "https://en.wikipedia.org/wiki/Conway's_law",
    "https://en.wikipedia.org/wiki/KISS_principle",
    "https://en.wikipedia.org/wiki/Project_Sanguine",
    "https://en.wikipedia.org/wiki/Ghoti",
    "https://en.wikipedia.org/wiki/Red_mercury",
    "https://en.wikipedia.org/wiki/Rayleigh_scattering",
    "https://en.wikipedia.org/wiki/SOSUS",
    "https://en.wikipedia.org/wiki/USS_Thresher_(SSN-593)",
    "https://en.wikipedia.org/wiki/Operation_Sea-Spray",
    "https://en.wikipedia.org/wiki/Camp_Century",
    "https://en.wikipedia.org/wiki/Perdido_Street_Station",
    "https://en.wikipedia.org/wiki/A_Memory_Called_Empire",
    "https://en.m.wikipedia.org/wiki/Splooting",
    "https://en.wikipedia.org/wiki/Arcology",
    "https://en.m.wikipedia.org/wiki/Microsoft_Bob",
    "https://en.m.wikipedia.org/wiki/Don_Norman",
    "https://en.wikipedia.org/wiki/Hannibal_Directive",
    "https://en.wikipedia.org/wiki/Dahiya_doctrine",
    "https://en.wikipedia.org/wiki/Out-of-place_artifact",
    "https://en.wikipedia.org/wiki/Long-term_nuclear_waste_warning_messages",
    "https://en.wikipedia.org/wiki/Tsunami_stone"

];
