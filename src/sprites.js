'use strict';

import { Phaser } from 'phaser';

const Direction = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

class GridSprite extends Phaser.Sprite {
  constructor(game, grid, gx, gy, shape) {
    super(game, 100, 100);

    this.anchor.setTo(0.5, 0.5);

    this.game.stage.addChild(this);

    this.grid = grid;

    this.gridPos = {
      x: gx,
      y: gy,
    };

    this.setPos();

    let startShape = shape;
    if (!startShape) startShape = 'circle';

    this.shape = null;
    this.setShape(startShape);

    this.direction = Direction.RIGHT;

    // Keep track of the sprite that's following us in line (if any)
    this.follower = null;

    // If we just spawned, don't advance the first time
    this.justSpawned = false;
  }

  advance() {
    if (this.justSpawned) {
      this.justSpawned = false;
      return;
    }

    const oldGridPos = { x: this.gridPos.x, y: this.gridPos.y };

    switch (this.direction) {
      case Direction.RIGHT:
        this.gridPos.x += 1;
        break;
      case Direction.LEFT:
        this.gridPos.x -= 1;
        break;
      case Direction.UP:
        this.gridPos.y -= 1;
        break;
      case Direction.DOWN:
        this.gridPos.y += 1;
        break;
      default:
        break;
    }

    if (this.grid.outOfBounds(this.gridPos)) {
      this.gridPos = oldGridPos;
      this.hitEdge();
    }
    this.setPos();

    if (this.follower) {
      this.follower.advance();
    }
  }

  hitEdge() {
    // TODO: Oops something should probably happen here
  }

  /**
   * To keep your followers behind you, tell your follower where to go next
   */
  passDirectionBack() {
    if (!this.follower) return;

    this.follower.passDirectionBack();

    this.follower.direction = this.direction;
  }

  /**
   * Spawn a shape at the very end of the line
   */
  spawnShapeAtEnd(shape) {
    if (!this.follower) {
      this.follower = new GridSprite(this.game, this.grid, this.gridPos.x, this.gridPos.y, shape);
      this.follower.justSpawned = true;
    } else {
      this.follower.spawnShapeAtEnd(shape);
    }
  }

  setPos() {
    const newPos = this.grid.gridToPixelPos(this.gridPos);

    this.position.x = newPos.x;
    this.position.y = newPos.y;
  }

  setShape(shape) {
    this.shape = shape;
    this.loadTexture(shape);
  }
}

class HeadSprite extends GridSprite {
  constructor(game, grid, gx, gy) {
    super(game, grid, gx, gy);

    this.shapes = ['circle', 'triangle', 'square', 'star'];
    this.shapeIndex = 0;
    this.setShape(this.shapes[this.shapeIndex]);
  }

  advance() {
    super.advance();

    this.shapeIndex++;
    this.shapeIndex = this.shapeIndex % this.shapes.length;
    this.setShape(this.shapes[this.shapeIndex]);

    // Start the chain of passing your direction backwards
    this.passDirectionBack();
  }

  update() {
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      this.direction = Direction.RIGHT;
    }
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      this.direction = Direction.LEFT;
    }
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
      this.direction = Direction.UP;
    }
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
      this.direction = Direction.DOWN;
    }
  }

  pickUp(shape) {
    this.spawnShapeAtEnd(shape);
  }
}

class PickUpFriendSprite extends GridSprite {
  constructor(game, grid, gx, gy) {
    super(game, grid, gx, gy);

    this.shapes = ['circle', 'triangle', 'square', 'star'];
    this.pickShape();
  }

  advance() {

  }

  pickShape() {
    const shapeIndex = this.game.rnd.integer() % this.shapes.length;
    this.setShape(this.shapes[shapeIndex]);
  }
}

export { HeadSprite, GridSprite, PickUpFriendSprite };
