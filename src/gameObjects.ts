export class BaseObject {
    x: number;
    y: number;
    movingRight: boolean;
    movingLeft: boolean;
    speed: number;
    character: HTMLImageElement;
    ctx: CanvasRenderingContext2D;

    constructor(x: number, y: number, ctx: CanvasRenderingContext2D) {
        this.x = x;
        this.y = y;
        this.movingRight = false;
        this.movingLeft = false;
        this.speed = 5;
        this.character = Object.assign(new Image(), { src: './assets/min-knight-128.png' });
        this.ctx = ctx;
    }
}

export class Player extends BaseObject {
    constructor(x: number, y: number, ctx: CanvasRenderingContext2D) {
        super(x, y, ctx);
        this.setupMovement();
    }

    setupMovement() {
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
    }

    draw() {
        this.ctx.drawImage(this.character, 0, 0);
    }
}