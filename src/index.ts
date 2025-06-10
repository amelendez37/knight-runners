import { GameState } from './classes/gameState';

function setWindowSize(canvas: HTMLCanvasElement, gameState: GameState) {
  gameState.setScreenDimensions(window.innerWidth, window.innerHeight);
  canvas.width = gameState.getScreenWidth();
  canvas.height = gameState.getScreenHeight();
}

function setupMenus(gameState: GameState, ctx: CanvasRenderingContext2D) {
  // start menu
  const startButton = document.querySelector('.startButton');
  startButton?.addEventListener('click', () => {
    gameState.startGame(() => gameLoop(gameState, ctx));
  });

  // game over menu
  const goAgainButton = document.querySelector('.goAgainButton');
  goAgainButton?.addEventListener('click', () => {
    gameState.restartGame(() => gameLoop(gameState, ctx));
  });
}

function drawObjects(gameState: GameState) {
  for (const platform of gameState.getPlatformObjects()) {
    platform.updateLocation();
    platform.draw();
  }

  for (const player of gameState.getPlayerObjects()) {
    player.updateLocation();
    player.draw();
  }
}

function gameLoop(gameState: GameState, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, gameState.getScreenWidth(), gameState.getScreenHeight());

  gameState.checkForDeadPlayers();
  drawObjects(gameState);

  requestAnimationFrame(() => gameLoop(gameState, ctx));
}

async function run() {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  // gives us methods to draw within our 2d canvas element
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const gameState = new GameState(ctx);

  setupMenus(gameState, ctx);
  setWindowSize(canvas, gameState);
  gameState.clearGameState();
  gameState.initObjects();
  window.addEventListener('resize', function () {
    setWindowSize(canvas, gameState);
  });

  gameLoop(gameState, ctx);
}

run();
