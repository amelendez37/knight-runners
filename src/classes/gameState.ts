import { Player, Platform } from './gameObjects';

export class GameState {
  #playerOjects: Player[] = [];
  #platformOjects: Platform[] = [];
  screenBottomEdge: number;
  screenRightEdge: number;

  constructor() {
    // need to re assign this on window resize
    this.screenBottomEdge = window.innerHeight;
    this.screenRightEdge = window.innerWidth;
  }

  getPlayerObjects() {
    return this.#playerOjects;
  }

  getPlatformObjects() {
    return this.#platformOjects;
  }

  getPlatformObjectsOnScreen() {
    // todo: return just the platforms that exist on screen for optimization, may need to separate platforms even further into sections
    return this.getPlatformObjects();
  }

  addPlatformObject(platformOject: Platform) {
    this.#platformOjects.push(platformOject);
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
}
