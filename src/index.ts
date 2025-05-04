import { GameState } from './classes/gameState';
import { Player, Platform } from './classes/gameObjects';

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
  canvas.width = gameState.getScreenWidth();
  canvas.height = gameState.getScreenHeight();

  const player = new Player(
    gameState.playerStartPos.x,
    gameState.playerStartPos.y / 2,
    ctx,
    gameState
  );

  const starterPlatform = new Platform(
    gameState.playerStartPos.x,
    gameState.playerStartPos.y / 2 + player.getHitbox().height + 10,
    ctx,
    gameState
  );

  gameState.addPlayerObject(player);
  gameState.addPlatformObject(starterPlatform);

  gameLoop(gameState, ctx);
}

run();
