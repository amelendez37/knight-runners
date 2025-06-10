import { Player, Platform } from './gameObjects';
import { PLAYER_HEIGHT, COLLISION_OFFSET } from '../constants';
import { getRandomFromArray } from '../utils';

export class GameState {
  #playerObjects: Player[] = [];
  #platformOjects: Platform[] = [];
  screenBottomEdge: number;
  screenRightEdge: number;
  ctx: CanvasRenderingContext2D;

  hasStarted = false;
  paused = true;
  hasGameEnded = false;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    // need to re assign this on window resize
    this.screenBottomEdge = window.innerHeight;
    this.screenRightEdge = window.innerWidth;
  }

  initObjects() {
    const STARTING_PLATFORM_LOC = {
      x: 0,
      y: this.getScreenHeight() / 2,
    };

    const player = new Player(
      STARTING_PLATFORM_LOC.x,
      STARTING_PLATFORM_LOC.y -
      PLAYER_HEIGHT * this.getScreenHeight() +
      COLLISION_OFFSET,
      this.ctx,
      this
    );
    this.addPlayerObject(player);

    // initial platform players start on
    const startingPlatform = new Platform(
      STARTING_PLATFORM_LOC.x,
      STARTING_PLATFORM_LOC.y,
      this.getPlatformObjects().length,
      this.ctx,
      this,
      Platform.WIDTH_MULTIPLIERS[Platform.WIDTH_MULTIPLIERS.length - 1],
    );
    this.addPlatformObject(startingPlatform);

    // rest of platforms that spawn in the game. These platforms are reused throughout session for efficiency
    for (let i = 0; i < 4; i++) {
      const currPlatforms = this.getPlatformObjects();
      const lastPlatform = currPlatforms[currPlatforms.length - 1];
      const nextPlatformLoc = Platform.getNewPlatformLoc(lastPlatform, this);
      const platform = new Platform(
        nextPlatformLoc[0],
        nextPlatformLoc[1],
        this.getPlatformObjects().length,
        this.ctx,
        this,
        getRandomFromArray(Platform.WIDTH_MULTIPLIERS),
      );
      this.addPlatformObject(platform);
    }
  }

  startGame(gameLoop: Function) {
    this.hideStartMenu();
    this.runCountdownAndExecuteGameLoop(gameLoop);
  }

  restartGame(gameLoop: Function) {
    this.clearGameState();
    this.initObjects();
    this.hideGameOverMenu();
    this.runCountdownAndExecuteGameLoop(gameLoop);
  }

  runCountdownAndExecuteGameLoop(gameLoop: Function) {
    this.runCountdown().then((intervalId) => {
      clearInterval(intervalId as number);
      const timer = document.querySelector('.timer') as HTMLParagraphElement;
      timer.innerHTML = '3';
      this.paused = false;
      gameLoop();
    });
  }

  async runCountdown() {
    const timer = document.querySelector('.timer') as HTMLParagraphElement;
    timer.classList.remove('hide');

    return new Promise((res) => {
      let count = 3;

      const intervalId = setInterval(() => {
        count -= 1;
        timer.innerHTML = count.toString();
        if (count == 0) {
          timer.classList.add('hide');
          res(intervalId);
        }
      }, 1000);
    });
  }

  getPlatformObjects() {
    return this.#platformOjects;
  }

  getPlatformObjectsOnScreen() {
    // todo: return just the platforms that exist on screen for optimization, may need to separate platforms even further into sections?
    return this.getPlatformObjects();
  }

  addPlatformObject(platformOject: Platform) {
    this.#platformOjects.push(platformOject);
  }

  deletePlatformObject(platformOject: Platform) {
    for (let i = 0; i < this.#platformOjects.length; i++) {
      if (this.#platformOjects[i] === platformOject) {
        this.#platformOjects.splice(i, 1);
      }
    }
  }

  addPlayerObject(playerObject: Player) {
    this.#playerObjects.push(playerObject);
  }

  getPlayerObjects() {
    return this.#playerObjects;
  }

  setScreenDimensions(width: number, height: number) {
    this.screenRightEdge = width;
    this.screenBottomEdge = height;
  }

  getScreenHeight() {
    return this.screenBottomEdge;
  }

  getScreenWidth() {
    return this.screenRightEdge;
  }

  scaleX(width: number) {
    return this.getScreenWidth() * width;
  }

  scaleY(height: number) {
    return this.getScreenHeight() * height;
  }

  clearGameState() {
    this.#playerObjects = [];
    this.#platformOjects = [];
    this.hasStarted = false;
    this.paused = true;
    this.hasGameEnded = false;
  }

  checkForDeadPlayers() {
    for (const player of this.getPlayerObjects()) {
      if (this.checkIsOutOfBounds(player)) {
        this.endGame();
      }
    }
  }

  checkIsOutOfBounds(player: Player) {
    return player.loc.y > this.getScreenHeight() || player.loc.x < 0;
  }

  endGame() {
    this.hasGameEnded = true;
    this.showGameOverMenu();
  }

  showStartMenu() {
    document.querySelector('.menu')?.classList.remove('hide');
  }

  hideStartMenu() {
    document.querySelector('.menu')?.classList.add('hide');
  }

  showGameOverMenu() {
    document.querySelector('.gameOverMenu')?.classList.remove('hide');
  }

  hideGameOverMenu() {
    document.querySelector('.gameOverMenu')?.classList.add('hide');
  }
}
