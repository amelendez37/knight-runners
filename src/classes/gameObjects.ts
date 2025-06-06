import { GameState } from './gameState';
import {
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_ASSET_WIDTH,
  PLAYER_ASSET_HEIGHT,
  PLATFORM_HEIGHT,
  PLATFORM_WIDTH,
  COLLISION_OFFSET,
  PLAYER_HITBOX_X_OFFSET,
  PLAYER_HITBOX_Y_OFFSET,
  PLATFORM_HITBOX_X_OFFSET,
  PLATFORM_HITBOX_Y_OFFSET,
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

interface Sprite {
  img: HTMLImageElement;
  height: number;
  width: number;
}

export class BaseObject {
  loc: Location;
  movingRight: boolean;
  movingLeft: boolean;
  horizontalVelocity: number;
  verticalVelocity: number;
  gravity: number;
  sprite: Sprite;
  hitbox = {} as Hitbox;
  ctx: CanvasRenderingContext2D;
  gameState: GameState;

  // used to calculate speed based on time between frames
  lastRenderTimestamp = 0;

  // constants
  HORIZONTAL_VELOCITY_DEFAULT = 0.15;
  VERTICAL_VELOCITY_DEFAULT = 0;
  GRAVITY_DEFAULT = 0.42;
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
    this.horizontalVelocity =
      gameState.getScreenWidth() * this.HORIZONTAL_VELOCITY_DEFAULT;
    this.verticalVelocity =
      gameState.getScreenHeight() * this.VERTICAL_VELOCITY_DEFAULT;
    this.gravity = gameState.getScreenHeight() * this.GRAVITY_DEFAULT;
    this.sprite = { img: new Image(), width: 0, height: 0 };
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
    this.ctx.drawImage(
      this.sprite.img,
      this.loc.x,
      this.loc.y,
      this.sprite.width,
      this.sprite.height
    );
  }
}

export class Player extends BaseObject {
  jumpVelocity: number;

  JUMP_VELOCITY = 1.2;

  constructor(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    gameState: GameState
  ) {
    super(x, y, ctx, gameState);
    this.gameState = gameState;
    this.sprite.img.src = './assets/min-knight-128.png';
    this.sprite.height = this.gameState.scaleY(PLAYER_ASSET_HEIGHT);
    this.sprite.width = this.gameState.scaleX(PLAYER_ASSET_WIDTH);
    this.hitbox = {
      width: this.gameState.scaleX(PLAYER_WIDTH),
      height: this.gameState.scaleY(PLAYER_HEIGHT),
      xOffset: this.gameState.scaleX(PLAYER_HITBOX_X_OFFSET),
      yOffset: this.gameState.scaleY(PLAYER_HITBOX_Y_OFFSET),
    };
    this.jumpVelocity = this.gameState.scaleY(this.JUMP_VELOCITY);

    this.setupMovementControls();
  }

  checkCollisions() {
    let noBottomCollisionCount = 0;
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
        this.horizontalVelocity = this.gameState.scaleX(
          this.HORIZONTAL_VELOCITY_DEFAULT
        );
      }

      const playerBottomCollision =
        this.getRightBound() >= platform.getLeftBound() + COLLISION_OFFSET &&
        this.getLeftBound() <= platform.getRightBound() - COLLISION_OFFSET &&
        this.getBottomBound() >= platform.getTopBound() &&
        this.getBottomBound() <= platform.getBottomBound();
      if (playerBottomCollision) {
        this.gravity = 0;
        // snap player to ground level they're colliding with in case of late collision detection
        this.loc.y =
          platform.getTopBound() - (this.hitbox.height + this.hitbox.yOffset);
        this.hitbox.isOnGround = true;
        return;
      }

      noBottomCollisionCount += 1;
      if (
        noBottomCollisionCount ===
        this.gameState.getPlatformObjectsOnScreen().length
      ) {
        this.gravity = this.gameState.scaleY(this.GRAVITY_DEFAULT);
      }
      this.hitbox.isOnGround = false;
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
    const oldY = this.loc.y;
    this.loc.y +=
      (this.gravity - this.verticalVelocity) * this.SPEED_CONSTANT * delta;
    if (this.verticalVelocity > 0) {
      if (oldY < this.loc.y) {
        // we're falling so make player drop faster
        this.verticalVelocity -=
          this.gravity * 100 * this.SPEED_CONSTANT * delta;
      } else {
        // we're moving up but decelerating
        this.verticalVelocity -= this.gravity * 3 * this.SPEED_CONSTANT * delta;
      }
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
  index: number;

  static PLATFORM_X_SPAWN_DISTANCE = 0.15;

  constructor(
    x: number,
    y: number,
    index: number,
    ctx: CanvasRenderingContext2D,
    gameState: GameState,
    widthMultiplier = 1,
  ) {
    super(x, y, ctx, gameState);
    this.loc = { x, y };
    this.index = index;
    // this.sprite.img.src = './assets/platform-min.png';
    this.sprite.height = this.gameState.scaleY(PLAYER_ASSET_HEIGHT);
    this.sprite.width = this.gameState.scaleX(PLAYER_ASSET_WIDTH);
    this.HORIZONTAL_VELOCITY_DEFAULT = .14;
    this.horizontalVelocity = this.gameState.scaleX(
      this.HORIZONTAL_VELOCITY_DEFAULT
    );
    this.movingLeft = true;

    this.hitbox = {
      width: this.gameState.scaleX(PLATFORM_WIDTH) * widthMultiplier,
      height: this.gameState.scaleY(PLATFORM_HEIGHT),
      yOffset: this.gameState.scaleY(PLATFORM_HITBOX_Y_OFFSET),
      xOffset: this.gameState.scaleX(PLATFORM_HITBOX_X_OFFSET),
    };
  }

  static getNewPlatformLoc(lastPlatform: Platform, gameState: GameState) {
    // max amount of y distance we can have the next platform
    const NEXT_PLATFORM_Y_OFFSET = gameState.scaleY(0.25);
    const playerHeight = gameState.scaleY(PLAYER_HEIGHT);
    const spawnAbove = Math.random() < 0.5;
    let nextYPos;
    if (spawnAbove) {
      nextYPos = lastPlatform.loc.y + NEXT_PLATFORM_Y_OFFSET;
    } else {
      nextYPos = lastPlatform.loc.y - NEXT_PLATFORM_Y_OFFSET;
    }

    let finalNextYPos;
    // too low
    if (nextYPos > gameState.getScreenHeight() - lastPlatform.hitbox.height) {
      finalNextYPos = gameState.getScreenHeight() - lastPlatform.hitbox.height;
      // too high
    } else if (nextYPos <= playerHeight * 2) {
      finalNextYPos = playerHeight;
      // okay
    } else {
      finalNextYPos = nextYPos;
    }

    // if (nextYPos > lastPlatform.loc.y) {
    //   nextYPos += NEXT_PLATFORM_Y_OFFSET;
    // } else {
    //   nextYPos -= NEXT_PLATFORM_Y_OFFSET;
    // }

    return [
      lastPlatform.loc.x + lastPlatform.hitbox.width + gameState.scaleX(Platform.PLATFORM_X_SPAWN_DISTANCE),
      finalNextYPos,
    ];
  }

  updateLocation() {
    const now = Date.now() / 1000; // current timestamp in seconds
    if (!this.lastRenderTimestamp) {
      this.lastRenderTimestamp = now;
    }
    const delta = now - this.lastRenderTimestamp;
    this.lastRenderTimestamp = now;

    this.loc.x -= this.horizontalVelocity * this.SPEED_CONSTANT * delta;

    if (this.loc.x < -this.hitbox.width) {
      const indexForRightMostPlatform =
        this.index - 1 < 0
          ? this.gameState.getPlatformObjects().length - 1
          : this.index - 1;
      const rightMostPlatform =
        this.gameState.getPlatformObjects()[indexForRightMostPlatform];
      this.loc.x =
        rightMostPlatform.loc.x + rightMostPlatform.hitbox.width +
        this.gameState.scaleX(Platform.PLATFORM_X_SPAWN_DISTANCE);
      this.loc.y = Platform.getNewPlatformLoc(
        rightMostPlatform,
        this.gameState
      )[1];
    }
  }
}
