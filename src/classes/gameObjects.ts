import { GameState } from './gameState';
import {
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  PLATFORM_HEIGHT,
  PLATFORM_WIDTH,
  COLLISION_OFFSET,
  PLAYER_HITBOX_X_OFFSET,
  PLAYER_HITBOX_Y_OFFSET,
} from '../constants';
import { Location } from '../types';

export type GameObjectType = BaseObject | Player;

interface Hitbox {
  width: number;
  height: number;
  xOffset: number;
  yOffset: number;
  isOnGround?: boolean;
}

export class BaseObject {
  loc: Location;
  movingRight: boolean;
  movingLeft: boolean;
  horizontalVelocity: number;
  verticalVelocity: number;
  gravity: number;
  model: HTMLImageElement;
  hitbox = {} as Hitbox;
  ctx: CanvasRenderingContext2D;
  gameState: GameState;

  lastRenderTimestamp = 0;

  // constants
  HORIZONTAL_VELOCITY_DEFAULT = .15;
  VERTICAL_VELOCITY_DEFAULT = 0;
  GRAVITY_DEFAULT = .2;
  SPEED_CONSTANT = 1.5; // for tweaking speed of all objects

  constructor(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    gameState: GameState
  ) {
    this.loc = { x, y };
    this.movingRight = false;
    this.movingLeft = false;
    this.horizontalVelocity = gameState.getScreenWidth() * this.HORIZONTAL_VELOCITY_DEFAULT;
    this.verticalVelocity = gameState.getScreenHeight() * this.VERTICAL_VELOCITY_DEFAULT;
    this.gravity = gameState.getScreenHeight() * this.GRAVITY_DEFAULT;
    this.model = new Image();
    this.ctx = ctx;
    this.gameState = gameState;
  }

  getLeftBound() {
    return this.loc.x + this.hitbox.xOffset;
  }

  getRightBound() {
    return this.loc.x + this.hitbox.xOffset + this.hitbox.width;
  }

  getBottomBound() {
    return this.loc.y + this.hitbox.yOffset + this.hitbox.height;
  }

  getTopBound() {
    return this.loc.y - this.hitbox.yOffset;
  }

  draw() {
    // debug hitbox
    this.ctx.strokeRect(
      this.getLeftBound(),
      this.getTopBound(),
      this.hitbox.width,
      this.hitbox.height
    );
    this.ctx.drawImage(this.model, this.loc.x, this.loc.y);
  }
}

export class Player extends BaseObject {
  jumpVelocity: number;

  JUMP_VELOCITY = .703;

  constructor(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    gameState: GameState
  ) {
    super(x, y, ctx, gameState);
    this.gameState = gameState;
    this.model.src = './assets/min-knight-128.png';
    this.hitbox = {
      width: gameState.getScreenWidth() * PLAYER_WIDTH,
      height: gameState.getScreenHeight() * PLAYER_HEIGHT,
      xOffset: gameState.getScreenWidth() * PLAYER_HITBOX_X_OFFSET,
      yOffset: gameState.getScreenHeight() * PLAYER_HITBOX_Y_OFFSET,
    };
    this.setupMovementControls();
    this.jumpVelocity = gameState.getScreenHeight() * this.JUMP_VELOCITY;
  }

  checkCollisions() {
    for (const platform of this.gameState.getPlatformObjectsOnScreen()) {
      // if player is in between x and y ranges of the platform then it's a collision
      const playerLeftSideCollision =
        this.movingLeft &&
        this.getLeftBound() <= platform.getRightBound() &&
        this.getLeftBound() >= platform.getLeftBound() &&
        this.getTopBound() <= platform.getBottomBound() + COLLISION_OFFSET &&
        this.getBottomBound() >= platform.getTopBound() + COLLISION_OFFSET;
      const playerRightSideCollision =
        this.movingRight &&
        this.getRightBound() >= platform.getLeftBound() &&
        this.getRightBound() <= platform.getRightBound() &&
        this.getTopBound() <= platform.getBottomBound() + COLLISION_OFFSET &&
        this.getBottomBound() >= platform.getTopBound() + COLLISION_OFFSET;
      if (playerLeftSideCollision || playerRightSideCollision) {
        this.horizontalVelocity = 0;
      } else {
        this.horizontalVelocity = this.gameState.getScreenWidth() * this.HORIZONTAL_VELOCITY_DEFAULT;
      }

      const playerBottomCollision =
        this.getRightBound() >= platform.getLeftBound() + COLLISION_OFFSET &&
        this.getLeftBound() <= platform.getRightBound() - COLLISION_OFFSET &&
        this.getBottomBound() >= platform.getTopBound() &&
        this.getBottomBound() <= platform.getBottomBound();
      if (playerBottomCollision) {
        this.gravity = 0;
        // snap player to ground level they're colliding with in case of late collision detection
        this.loc.y = platform.getTopBound() - this.hitbox.height;
        this.hitbox.isOnGround = true;
        break;
      } else {
        this.gravity = this.gameState.getScreenHeight() * this.GRAVITY_DEFAULT;
        this.hitbox.isOnGround = false;
      }
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
      this.loc.x += this.horizontalVelocity * this.SPEED_CONSTANT * delta;
    } else if (this.movingLeft) {
      this.loc.x -= this.horizontalVelocity * this.SPEED_CONSTANT * delta;
    }

    // update vertical movement
    this.loc.y +=
      (this.gravity - this.verticalVelocity) * this.SPEED_CONSTANT * delta;
    if (this.verticalVelocity > 0) {
      this.verticalVelocity -= this.jumpVelocity * this.SPEED_CONSTANT * delta;
    } else {
      this.verticalVelocity = 0;
    }
  }

  setupMovementControls() {
    document.addEventListener('keydown', (e) => {
      // right and left movements
      if (e.key === 'ArrowRight') {
        this.movingRight = true;
      } else if (e.key === 'ArrowLeft') {
        this.movingLeft = true;
      }

      // jump
      if (e.key === ' ' && this.hitbox.isOnGround) {
        this.verticalVelocity = this.jumpVelocity;
        this.hitbox.isOnGround = false;
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowRight') {
        this.movingRight = false;
      } else if (e.key === 'ArrowLeft') {
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
    this.model.src = './assets/platform-min.png';
    // this.movingLeft = true;
    // this.horizontalVelocity = 2;
    this.hitbox = {
      width: gameState.getScreenWidth() * PLATFORM_WIDTH,
      height: gameState.getScreenHeight() * PLATFORM_HEIGHT,
      yOffset: -6,
      xOffset: 5,
    };
  }
}
