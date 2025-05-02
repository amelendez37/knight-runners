import { Player } from './classes/gameObjects';
import { checkIsInBounds } from "./utils";

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
// gives us methods to draw within our 2d canvas element
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;

function gameLoop(gameObjects: any[]) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (const object of gameObjects) {
        object.update();
        object.draw();
    }

    requestAnimationFrame(() => gameLoop(gameObjects));
}

function run() {
    const player = new Player(0, 0, ctx);
    gameLoop([player]);
}

run();
