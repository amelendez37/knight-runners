import { Player, Platform } from './gameObjects';

export class GameState {
  #playerOjects: Player[] = [];
  #platformOjects: Platform[] = [];
  screenBottomEdge: number;
  screenRightEdge: number;

  hasStarted = false;
  paused = true;

  constructor() {
    // need to re assign this on window resize
    this.screenBottomEdge = window.innerHeight;
    this.screenRightEdge = window.innerWidth;
  }

  startGame(gameState: GameState, gameLoop: Function) {
    const menu = document.querySelector('.menu');
    menu?.classList.add('hide');
    this.runCountdown().then((intervalId) => {
      clearInterval(intervalId as number);
      gameState.paused = false;
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

  getPlayerObjects() {
    return this.#playerOjects;
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
    this.#playerOjects.push(playerObject);
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
    this.#playerOjects = [];
    this.#platformOjects = [];
  }
}
