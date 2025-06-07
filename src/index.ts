import { GameState } from './classes/gameState';
import { Player, Platform } from './classes/gameObjects';
import { PLAYER_HEIGHT, COLLISION_OFFSET } from './constants';
import { getRandomFromArray } from './utils';

function setWindowSize(canvas: HTMLCanvasElement, gameState: GameState) {
  gameState.setScreenDimensions(window.innerWidth, window.innerHeight);
  canvas.width = gameState.getScreenWidth();
  canvas.height = gameState.getScreenHeight();
}

function setupMenu(gameState: GameState, ctx: CanvasRenderingContext2D) {
  const startButton = document.querySelector('.startButton');
  startButton?.addEventListener('click', () => {
    setTimeout(() => {
      const menu = document.querySelector('.menu') as HTMLDivElement;
      menu.classList.add('hide');

      gameState.hasStarted = true;
      gameLoop(gameState, ctx);
    }, 3000);
  });
}

function initObjects(gameState: GameState, ctx: CanvasRenderingContext2D) {
  gameState.clearGameState();

  const STARTING_PLATFORM_LOC = {
    x: 0,
    y: gameState.getScreenHeight() / 2,
  };

  const player = new Player(
    STARTING_PLATFORM_LOC.x,
    STARTING_PLATFORM_LOC.y -
    PLAYER_HEIGHT * gameState.getScreenHeight() +
    COLLISION_OFFSET,
    ctx,
    gameState
  );
  gameState.addPlayerObject(player);

  // initial platform players start on
  const startingPlatform = new Platform(
    STARTING_PLATFORM_LOC.x,
    STARTING_PLATFORM_LOC.y,
    gameState.getPlatformObjects().length,
    ctx,
    gameState,
    Platform.WIDTH_MULTIPLIERS[Platform.WIDTH_MULTIPLIERS.length - 1],
  );
  gameState.addPlatformObject(startingPlatform);

  // rest of platforms that spawn in the game. These platforms are reused throughout session for efficiency
  for (let i = 0; i < 4; i++) {
    const currPlatforms = gameState.getPlatformObjects();
    const lastPlatform = currPlatforms[currPlatforms.length - 1];
    const nextPlatformLoc = Platform.getNewPlatformLoc(lastPlatform, gameState);
    const platform = new Platform(
      nextPlatformLoc[0],
      nextPlatformLoc[1],
      gameState.getPlatformObjects().length,
      ctx,
      gameState,
      getRandomFromArray(Platform.WIDTH_MULTIPLIERS),
    );
    gameState.addPlatformObject(platform);
  }
}

function gameLoop(gameState: GameState, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, gameState.getScreenWidth(), gameState.getScreenHeight());

  for (const platform of gameState.getPlatformObjects()) {
    platform.updateLocation();
    platform.draw();
  }

  for (const player of gameState.getPlayerObjects()) {
    player.updateLocation();
    player.draw();
  }

  requestAnimationFrame(() => gameLoop(gameState, ctx));
}

async function run() {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  // gives us methods to draw within our 2d canvas element
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const gameState = new GameState();

  setupMenu(gameState, ctx);
  initObjects(gameState, ctx);
  setWindowSize(canvas, gameState);
  window.addEventListener('resize', function () {
    setWindowSize(canvas, gameState);
  });

  // todo: remove
  gameLoop(gameState, ctx);
}

run();
