import { GameObjectType } from './gameObjects';

export class GameState {
    #gameObjects: GameObjectType[] = [];
    #screenBottomEdge: number;
    #screenRightEdge: number;

    constructor() {
        this.#screenBottomEdge = window.innerHeight;
        this.#screenRightEdge = window.innerWidth;
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
