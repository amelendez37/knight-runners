const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
// gives us methods to draw within our 2d canvas element
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image(); // need to get basic sprite images
// playerImage.src = // path to sprite sheet
