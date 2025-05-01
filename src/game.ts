const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
// gives us methods to draw within our 2d canvas element
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;

const playerImage = new Image(); // need to get basic sprite images
playerImage.src = './assets/skinny-knight.png';

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(playerImage, 0, 0);
    requestAnimationFrame(animate);
}

animate();
