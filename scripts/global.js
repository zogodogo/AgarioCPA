const main_window = document.getElementById('main_window');

main_window.width = window.innerWidth;
main_window.height = window.innerHeight;

const context = main_window.getContext('2d');

var width = main_window.width;
var height = main_window.height;

const worldWidth = 5000;
const worldHeight = 5000;
const gravityStrength = 0.1;
const friction = 0.98;
