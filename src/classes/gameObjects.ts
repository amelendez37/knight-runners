import { GameState } from "./gameState";

export type GameObjectType = BaseObject | Player;

interface Hitbox {
    width: number;
    height: number;
}

export class BaseObject {
    x: number;
    y: number;
    movingRight: boolean;
    movingLeft: boolean;
    speed: number;
    gravity: number;
    model: HTMLImageElement;
    #hitbox = {} as Hitbox;
    ctx: CanvasRenderingContext2D;
    #gameState: GameState;

    constructor(x: number, y: number, ctx: CanvasRenderingContext2D, gameState: GameState) {
        this.x = x;
        this.y = y;
        this.movingRight = false;
        this.movingLeft = false;
        this.speed = 4;
        this.gravity = 5;
        this.model = new Image();
        this.ctx = ctx;
        this.#gameState = gameState;
    }

    checkCollisionLeft() {
        if (this.x - this.getHitbox().width <= 0) {
            return true;
        }
        return false;
    }

    checkCollisionRight() {
        if (this.x + this.getHitbox().width >= this.#gameState.getScreenWidth()) {
            return true;
        }
        return false;
    }

    checkCollisionBottom() {
        // todo: will remove this condition since the game will not have a floor in the future
        if (this.y + this.getHitbox().height >= this.#gameState.getScreenHeight()) {
            return true;
        }
        return false;
    }

    setHitbox(hitbox: Hitbox) {
        this.#hitbox = hitbox;
    }

    getHitbox() {
        return this.#hitbox;
    }

    update() {
        // update horizontal movement
        if (this.movingRight && !this.checkCollisionRight()) {
            this.x += this.speed;
        } else if (this.movingLeft && !this.checkCollisionLeft()) {
            this.x -= this.speed;
        }

        // update vertical movement
        if (!this.checkCollisionBottom()) {
            this.y += this.gravity;
        }
    }

    draw() {
        this.ctx.drawImage(this.model, this.x, this.y);
    }
}

export class Player extends BaseObject {
    constructor(x: number, y: number, ctx: CanvasRenderingContext2D, gameState: GameState) {
        super(x, y, ctx, gameState);
        this.model.src = './assets/min-knight-128.png';
        this.setHitbox({
            width: 60,
            height: 121,
        });
        this.setupMovementControls();
    }

    setupMovementControls() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'd') {
                this.movingRight = true;
            } else if (e.key === 'a') {
                this.movingLeft = true;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'd') {
                this.movingRight = false;
            } else if (e.key === 'a') {
                this.movingLeft = false;
            }
        });

        // todo: need to bind jump
    }
}

export class Platform extends BaseObject {
    constructor(x: number, y: number, ctx: CanvasRenderingContext2D, gameState: GameState) {
        super(x, y, ctx, gameState);
        this.movingLeft = true;
        this.speed = 2;
    }
}
