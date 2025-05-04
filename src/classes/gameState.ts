import { GameObjectType } from './gameObjects';
import { Location } from '../types';

export class GameState {
  #gameObjects: GameObjectType[] = [];
  #screenBottomEdge: number;
  #screenRightEdge: number;
  gameStartPos: Location;

  constructor() {
    // need to re assign this on window resize
    this.#screenBottomEdge = window.innerHeight;
    this.#screenRightEdge = window.innerWidth;
    this.gameStartPos = { x: 0, y: this.#screenBottomEdge / 1.1 };
  }

  getGameObjects() {
    return this.#gameObjects;
  }

  addGameObject(gameObject: GameObjectType) {
    this.#gameObjects.push(gameObject);
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
