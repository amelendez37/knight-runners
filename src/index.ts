import { GameState } from './classes/gameState';
import { Player } from './classes/gameObjects';

function gameLoop(gameState: GameState, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, gameState.getScreenWidth(), gameState.getScreenHeight());

  for (const object of gameState.getGameObjects()) {
    object.update();
    object.draw();
  }

  requestAnimationFrame(() => gameLoop(gameState, ctx));
}

function run() {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  // gives us methods to draw within our 2d canvas element
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const gameState = new GameState();
  canvas.width = gameState.getScreenWidth();
  canvas.height = gameState.getScreenHeight();
  const player = new Player(
    gameState.gameStartPos.x,
    gameState.gameStartPos.y / 2,
    ctx,
    gameState
  );
  gameState.addGameObject(player);

  gameLoop(gameState, ctx);
}

run();
