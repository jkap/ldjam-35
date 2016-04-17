'use strict';

import { Phaser } from 'phaser';

import { Shape, ShapeColors } from 'grid-util';

class GridEntity {
  constructor(game, grid, pos, color, shape) {
    this.game = game;
    this.grid = grid;

    // Position on the grid
    this.pos = pos;

    this.color = color;

    this.shape = shape;
  }

  advance() {

  }

  update() {

  }

  draw(graphics) {
    const size = this.grid.squareSize;
    const pixpos = this.grid.gridToPixelPos(this.pos);

    graphics.beginFill(this.color);
    switch (this.shape || this.grid.getShapeAt(this.pos)) {
      case Shape.SQUARE:
        graphics.drawRect(pixpos.x - size / 2,
                          pixpos.y - size / 2,
                          size, size);
        break;
      case Shape.CIRCLE:
        graphics.drawCircle(pixpos.x, pixpos.y, size);
        break;
      default:
        break;
    }
    graphics.endFill();
  }
}

class EnemyGridEntity extends GridEntity {
  constructor(game, grid, pos, shape) {
    const color = ShapeColors[shape];
    super(game, grid, pos, color, shape);
  }
  advance() {
    this.pos.y++;
  }
}

class PlayerGridEntity extends GridEntity {
  constructor(game, grid, pos) {
    super(game, grid, pos);

    this.lastRight = false;
    this.lastLeft = false;
    this.lastUp = false;
    this.lastDown = false;
  }

  update() {
    let tryToMove = false;
    const targetPos = { x: this.pos.x, y: this.pos.y };

    const right = this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
    const left = this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT);
    const up = this.game.input.keyboard.isDown(Phaser.Keyboard.UP);
    const down = this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN);

    if (right && !this.lastRight) {
      tryToMove = true;
      targetPos.x = Math.min(targetPos.x + 1, this.grid.width - 1);
    }
    if (left && !this.lastLeft) {
      tryToMove = true;
      targetPos.x = Math.max(targetPos.x - 1, 0);
    }
    if (up && !this.lastUp) {
      tryToMove = true;
      targetPos.y = Math.max(targetPos.y - 1, 0);
    }
    if (down && !this.lastDown) {
      tryToMove = true;
      targetPos.y = Math.min(targetPos.y + 1, this.grid.height - 1);
    }

    if (tryToMove) {
      const nailedIt = this.game.state.getCurrentState().inputWithinWindow();
      if (nailedIt) {
        this.pos = targetPos;
      } else {
        // TODO: ooooops you messed up
      }
    }

    this.lastRight = right;
    this.lastLeft = left;
    this.lastUp = up;
    this.lastDown = down;
  }

  draw(graphics) {
    this.color = ShapeColors[this.grid.getShapeAt(this.pos)];
    super.draw(graphics);
  }
}

export { PlayerGridEntity, EnemyGridEntity };
