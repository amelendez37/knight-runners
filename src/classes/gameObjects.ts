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

  lastRenderTimestamp = 0;

  HORIZONTAL_VELOCITY_DEFAULT = 400;
  VERTICAL_VELOCITY_DEFAULT = 0;
  JUMP_VELOCITY = 2400;
  GRAVITY_DEFAULT = 800;

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
  }

  updateLocation() {
    this.checkCollisions();
    // movement is updated based on time not renders so that
    // velocity does not change relative to fps
    const now = Date.now() / 1000; // current timestamp in seconds
    if (!this.lastRenderTimestamp) {
      this.lastRenderTimestamp = now;
    }
    const delta = now - this.lastRenderTimestamp;
    this.lastRenderTimestamp = now;
    // update horizontal movement
    if (this.movingRight) {
      this.x += this.horizontalVelocity * delta;
    } else if (this.movingLeft) {
      this.x -= this.horizontalVelocity * delta;
    }

    // update vertical movement
    this.y += (this.gravity - this.verticalVelocity) * delta;
    if (this.verticalVelocity > 0) {
      this.verticalVelocity -= Math.floor(this.JUMP_VELOCITY * delta);
    } else {
      this.verticalVelocity = 0;
    }
  }

  draw() {
    // debug hitbox
    this.ctx.strokeRect(
      this.getLeftBound(),
      this.getTopBound(),
      this.getHitbox().width,
      this.getHitbox().height
    );
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
        this.verticalVelocity = this.JUMP_VELOCITY;
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
