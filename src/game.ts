import { checkIsInBounds } from "./utils";

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
// gives us methods to draw within our 2d canvas element
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;

const playerImage = new Image();
playerImage.src = './assets/min-knight-128.png'; // todo: load sprite sheet

const playerState = {
    xPos: 0,
    yPos: 0,
};

function setupPlayers() {
    document.addEventListener('keydown', (e) => {
        // if (!checkIsInBounds()) return;
        // don't do it this way. track key presses instead and update character speed
        switch (e.key) {
            case 'a':
                playerState.xPos--;
                break;
            case 'd':
                playerState.xPos++;
                break;
        }
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(playerImage, playerState.xPos, playerState.yPos);
    requestAnimationFrame(gameLoop);
}

function run() {
    setupPlayers();
    gameLoop();
}

run();
