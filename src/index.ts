import { GameState } from './classes/gameState';
import { Player, Platform } from './classes/gameObjects';
import { PLAYER_HEIGHT, PLATFORM_HEIGHT } from './constants';

function gameLoop(gameState: GameState, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, gameState.getScreenWidth(), gameState.getScreenHeight());

  for (const platform of gameState.getPlatformObjects()) {
    // platform.updateLocation();
    platform.draw();
  }

  for (const player of gameState.getPlayerObjects()) {
    player.updateLocation();
    player.draw();
  }

  requestAnimationFrame(() => gameLoop(gameState, ctx));
}

function setWindowSize(canvas: HTMLCanvasElement, gameState: GameState) {
  gameState.setScreenDimensions(window.innerWidth, window.innerHeight);
  canvas.width = gameState.getScreenWidth();
  canvas.height = gameState.getScreenHeight();
}

function run() {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  // gives us methods to draw within our 2d canvas element
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const gameState = new GameState();
  setWindowSize(canvas, gameState);
  window.addEventListener('resize', function () {
    setWindowSize(canvas, gameState);
  });

  const STARTING_PLATFORM_LOC = { x: 0, y: gameState.getScreenHeight() - 100 };

  const player = new Player(
    STARTING_PLATFORM_LOC.x,
    STARTING_PLATFORM_LOC.y - PLAYER_HEIGHT,
    ctx,
    gameState
  );

  const startingPlatform = new Platform(
    STARTING_PLATFORM_LOC.x,
    STARTING_PLATFORM_LOC.y,
    ctx,
    gameState
  );

  // todo: create rest of platforms here. They will be recycled throughout the game and can be reassigned locs

  gameState.addPlayerObject(player);
  gameState.addPlatformObject(startingPlatform);

  gameLoop(gameState, ctx);
}

run();
