import { GameState } from "./gameState";

export type GameObjectType = BaseObject | Player;

interface Hitbox {
    width: number;
    height: number;
    xOffset: number;
    yOffset: number;
}

export class BaseObject {
    x: number;
    y: number;
    movingRight: boolean;
    movingLeft: boolean;
    speedLeft: number;
    speedRight: number;
    gravity: number;
    model: HTMLImageElement;
    hitbox = {} as Hitbox;
    ctx: CanvasRenderingContext2D;
    #gameState: GameState;

    SPEED_LEFT_DEFAULT = 4;
    SPEED_RIGHT_DEFAULT = 4;
    GRAVITY_DEFAULT = 5;

    constructor(x: number, y: number, ctx: CanvasRenderingContext2D, gameState: GameState) {
        this.x = x;
        this.y = y;
        this.movingRight = false;
        this.movingLeft = false;
        this.speedLeft = this.SPEED_LEFT_DEFAULT;
        this.speedRight = this.SPEED_RIGHT_DEFAULT;
        this.gravity = this.GRAVITY_DEFAULT;
        this.model = new Image();
        this.ctx = ctx;
        this.#gameState = gameState;
    }

    checkCollisions() {
        // left collision
        if (this.getLeftBound() <= 0) {
            this.speedLeft = 0;
        } else {
            this.speedLeft = this.SPEED_LEFT_DEFAULT;
        }

        // right collision
        if (this.getRightBound() >= this.#gameState.getScreenWidth()) {
            this.speedRight = 0;
        } else {
            this.speedLeft = this.SPEED_RIGHT_DEFAULT;
        }

        // bottom collision
        if (this.getBottomBound() >= this.#gameState.getScreenHeight()) {
            this.gravity = 0;
        } else {
            this.gravity = this.GRAVITY_DEFAULT;
        }

        // top collision
    }

    setHitbox(hitbox: Hitbox) {
        this.hitbox = hitbox;
    }

    getHitbox() {
        return this.hitbox;
    }

    getLeftBound() {
        return this.x + this.getHitbox().xOffset;
    }

    getRightBound() {
        return this.x + this.getHitbox().xOffset + this.getHitbox().width;
    }

    getBottomBound() {
        return this.y + this.getHitbox().yOffset + this.getHitbox().height;
    }

    getTopBound() {
        return this.y - this.getHitbox().yOffset;
    }

    update() {
        this.checkCollisions();
        // update horizontal movement
        if (this.movingRight) {
            this.x += this.speedRight;
        } else if (this.movingLeft) {
            this.x -= this.speedLeft;
        }

        // update vertical movement
        this.y += this.gravity;
    }

    draw() {
        // this.ctx.strokeRect(this.getLeftBound(), this.getTopBound(), this.getHitbox().width, this.getHitbox().height);
        this.ctx.drawImage(this.model, this.x, this.y);
    }
}

export class Player extends BaseObject {
    constructor(x: number, y: number, ctx: CanvasRenderingContext2D, gameState: GameState) {
        super(x, y, ctx, gameState);
        this.model.src = './assets/min-knight-128.png';
        this.setHitbox({
            width: 59,
            height: 121,
            xOffset: 22,
            yOffset: 0,
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

            // jump
            if (e.key === 'space') {
                this.gravity = -15;
                setTimeout(() => {
                    this.gravity = 5;
                }, 1000);
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'd') {
                this.movingRight = false;
            } else if (e.key === 'a') {
                this.movingLeft = false;
            }
        });
    }
}

export class Platform extends BaseObject {
    constructor(x: number, y: number, ctx: CanvasRenderingContext2D, gameState: GameState) {
        super(x, y, ctx, gameState);
        this.movingLeft = true;
        this.speedLeft = 2;
    }
}
