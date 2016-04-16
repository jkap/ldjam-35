'use strict';

import { Phaser } from 'phaser';

import { Shape } from 'grid';

class GridEntity {
  constructor(game, grid, pos, color) {
    this.game = game;
    this.grid = grid;

    // Position on the grid
    this.pos = pos;

    this.color = color;
  }

  advance() {

  }

  update() {

  }

  draw(graphics) {
    const size = this.grid.squareSize;
    const pixpos = this.grid.gridToPixelPos(this.pos);

    graphics.beginFill(this.color);
    switch (this.grid.getShapeAt(this.pos)) {
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
  advance() {
    this.pos.y++;
  }
}

class PlayerGridEntity extends GridEntity {
  constructor(game, grid, pos, color) {
    super(game, grid, pos, color);

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
      targetPos.x++;
    }
    if (left && !this.lastLeft) {
      tryToMove = true;
      targetPos.x--;
    }
    if (up && !this.lastUp) {
      tryToMove = true;
      targetPos.y--;
    }
    if (down && !this.lastDown) {
      tryToMove = true;
      targetPos.y++;
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
}

export { PlayerGridEntity, EnemyGridEntity };