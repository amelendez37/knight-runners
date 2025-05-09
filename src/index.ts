import { GameState } from './classes/gameState';
import { Player, Platform } from './classes/gameObjects';
import { PLAYER_HEIGHT, COLLISION_OFFSET } from './constants';


function setWindowSize(canvas: HTMLCanvasElement, gameState: GameState) {
  gameState.setScreenDimensions(window.innerWidth, window.innerHeight);
  canvas.width = gameState.getScreenWidth();
  canvas.height = gameState.getScreenHeight();
}

function initObjects(gameState: GameState, ctx: CanvasRenderingContext2D) {
  gameState.clearGameState();

  const STARTING_PLATFORM_LOC = { x: 0, y: gameState.getScreenHeight() - (gameState.scaleY(.04)) };

  const player = new Player(
    STARTING_PLATFORM_LOC.x,
    STARTING_PLATFORM_LOC.y - (PLAYER_HEIGHT * gameState.getScreenHeight()) + COLLISION_OFFSET,
    ctx,
    gameState
  );
  gameState.addPlayerObject(player);

  // initial platform players start on
  const startingPlatform = new Platform(
    STARTING_PLATFORM_LOC.x,
    STARTING_PLATFORM_LOC.y,
    ctx,
    gameState
  );
  gameState.addPlatformObject(startingPlatform);

  // rest of platforms that spawn in the game. These platforms are reused throughout session for efficiency
  for (let i = 0; i < 4; i++) {
    const currPlatforms = gameState.getPlatformObjects();
    const lastPlatform = currPlatforms[currPlatforms.length - 1];
    const platform = new Platform(lastPlatform.loc.x + gameState.scaleX(.2), lastPlatform.loc.y - gameState.scaleY(.2), ctx, gameState);
    gameState.addPlatformObject(platform);
  }
}

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

function run() {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  // gives us methods to draw within our 2d canvas element
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const gameState = new GameState();
  setWindowSize(canvas, gameState);
  window.addEventListener('resize', function () {
    setWindowSize(canvas, gameState);
  });

  initObjects(gameState, ctx);

  gameLoop(gameState, ctx);
}

run();
