import { Player, Platform } from './gameObjects';
import { Location } from '../types';

export class GameState {
  #playerOjects: Player[] = [];
  #platformOjects: Platform[] = [];
  #screenBottomEdge: number;
  #screenRightEdge: number;
  playerStartPos: Location;

  constructor() {
    // need to re assign this on window resize
    this.#screenBottomEdge = window.innerHeight;
    this.#screenRightEdge = window.innerWidth;
    this.playerStartPos = { x: 0, y: this.#screenBottomEdge / 1.1 };
  }

  getPlayerObjects() {
    return this.#playerOjects;
  }

  getPlatformObjects() {
    return this.#platformOjects;
  }

  addPlatformObject(platformOject: Platform) {
    this.#platformOjects.push(platformOject);
  }

  addPlayerObject(playerObject: Player) {
    this.#playerOjects.push(playerObject);
  }

  setScreenDimensions(width: number, height: number) {
    this.#screenRightEdge = width;
    this.#screenBottomEdge = height;
  }

  getScreenHeight() {
    return this.#screenBottomEdge;
  }

  getScreenWidth() {
    return this.#screenRightEdge;
  }
}
