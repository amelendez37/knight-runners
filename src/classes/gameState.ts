import { GameObjectType } from './gameObjects';

export class GameState {
    gameObjects: GameObjectType[] = [];

    constructor() { }

    addGameObject(gameObject: GameObjectType) {
        this.gameObjects.push(gameObject);
    }
}