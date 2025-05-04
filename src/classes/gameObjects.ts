import { GameState } from './gameState';

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
  horizontalVelocity: number;
  verticalVelocity: number;
  gravity: number;
  model: HTMLImageElement;
  hitbox = {} as Hitbox;
  ctx: CanvasRenderingContext2D;
  #gameState: GameState;

  HORIZONTAL_VELOCITY_DEFAULT = 8; // TODO: the feel of this changes based on fps
  VERTICAL_VELOCITY_DEFAULT = 0;
  GRAVITY_DEFAULT = 5;

  constructor(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    gameState: GameState
  ) {
    this.x = x;
    this.y = y;
    this.movingRight = false;
    this.movingLeft = false;
    this.horizontalVelocity = this.HORIZONTAL_VELOCITY_DEFAULT;
    this.verticalVelocity = this.VERTICAL_VELOCITY_DEFAULT;
    this.gravity = this.GRAVITY_DEFAULT;
    this.model = new Image();
    this.ctx = ctx;
    this.#gameState = gameState;
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

  checkCollisions() {
    // horizontal collision
    if (
      (this.getLeftBound() <= 0 && this.movingLeft) ||
      (this.getRightBound() >= this.#gameState.getScreenWidth() &&
        this.movingRight)
    ) {
      this.horizontalVelocity = 0;
    } else {
      this.horizontalVelocity = this.HORIZONTAL_VELOCITY_DEFAULT;
    }

    // bottom collision
    if (this.getBottomBound() >= this.#gameState.getScreenHeight()) {
      this.gravity = 0;
    } else {
      this.gravity = this.GRAVITY_DEFAULT;
    }

    // top collision
  }

  update() {
    this.checkCollisions();
    // update horizontal movement
    if (this.movingRight) {
      this.x += this.horizontalVelocity;
    } else if (this.movingLeft) {
      this.x -= this.horizontalVelocity;
    }

    // update vertical movement
    this.y += this.gravity - this.verticalVelocity;
  }

  draw() {
    // this.ctx.strokeRect(
    //   this.getLeftBound(),
    //   this.getTopBound(),
    //   this.getHitbox().width,
    //   this.getHitbox().height
    // );
    this.ctx.drawImage(this.model, this.x, this.y);
  }
}

export class Player extends BaseObject {
  constructor(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    gameState: GameState
  ) {
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
      // right and left movements
      if (e.key === 'd') {
        this.movingRight = true;
      } else if (e.key === 'a') {
        this.movingLeft = true;
      }

      // jump
      if (e.key === ' ') {
        this.verticalVelocity = 10;
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
  constructor(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    gameState: GameState
  ) {
    super(x, y, ctx, gameState);
    this.movingLeft = true;
    this.horizontalVelocity = 2;
  }
}
