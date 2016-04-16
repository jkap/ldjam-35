'use strict';

import { Phaser } from 'phaser';

const Direction = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

class GridSprite extends Phaser.Sprite {
  constructor(game, grid) {
    super(game, 100, 100, 'square');

    this.anchor.setTo(0.5, 0.5);

    this.game.stage.addChild(this);

    this.grid = grid;

    this.gridPos = {
      x: 0,
      y: 0,
    };

    this.setPos();

    this.direction = Direction.RIGHT;
  }

  advance() {
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

    this.setPos();
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

  setPos() {
    const newPos = this.grid.gridToPixelPos(this.gridPos);

    this.position.x = newPos.x;
    this.position.y = newPos.y;
  }
}

export { GridSprite };
