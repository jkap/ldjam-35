'use strict';

import { Phaser } from 'phaser';

import { Shape, ShapeColors } from 'grid-util';

// How wide the enemies are/how much smaller player should be
const LINEWIDTH = 5;

class GridEntity {
  constructor(game, grid, pos, color, shape) {
    this.game = game;
    this.grid = grid;

    // 'real' position on the grid (for collisions and stuff)
    this.pos = pos;

    // 'fake' position on the grid (for drawing and stuff)
    this.fakePos = null;

    this.color = color;

    this.shape = shape;
  }

  advance(tweenTime) {

  }

  update() {

  }

  draw(graphics, pulse) {
    const dispPos = this.fakePos || this.pos;
    const size = this.grid.squareSize;
    const pixpos = this.grid.gridToPixelPos(dispPos);
    const scaledPulse = pulse * 5;

    graphics.beginFill(this.color);
    switch (this.shape || this.grid.getShapeAt(dispPos)) {
      case Shape.SQUARE:
        graphics.drawRect(pixpos.x - size / 2 - scaledPulse / 2,
                          pixpos.y - size / 2 - scaledPulse / 2,
                          size + scaledPulse, size + scaledPulse);
        break;
      case Shape.CIRCLE:
        graphics.drawCircle(pixpos.x, pixpos.y, size + scaledPulse);
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

  draw(graphics, pulse) {
    const dispPos = this.pos;
    const size = this.grid.squareSize;
    const pixpos = this.grid.gridToPixelPos(dispPos);
    const scaledPulse = pulse * 5;

    graphics.lineStyle(LINEWIDTH, this.color, 1);
    graphics.beginFill(0xFAFAFA);
    graphics.fillAlpha = 0;
    switch (this.shape) {
      case Shape.SQUARE:
        graphics.drawRect(pixpos.x - size / 2 - scaledPulse / 2,
                          pixpos.y - size / 2 - scaledPulse / 2,
                          size + scaledPulse, size + scaledPulse);
        break;
      case Shape.CIRCLE:
        graphics.drawCircle(pixpos.x, pixpos.y, size + scaledPulse);
        break;
      default:
        break;
    }
    graphics.endFill();
    graphics.lineStyle(0, null, 0);
  }

  collides(player, shouldShapesMatch) {
    let colliding = false;
    let shapesMatch = true;
    if (this.pos.x === player.pos.x && this.pos.y === player.pos.y) {
      colliding = true;
      shapesMatch = this.shape === this.grid.getShapeAt(this.pos);
    }

    return colliding && (shouldShapesMatch === shapesMatch);
  }
}

class PlayerGridEntity extends GridEntity {
  constructor(game, grid, pos) {
    super(game, grid, pos);

    this.lastRight = false;
    this.lastLeft = false;
    this.lastUp = false;
    this.lastDown = false;

    // If the player has already moved during this beat, don't let them move again
    this.movedThisWindow = false;
  }

  update() {
    let tryToMove = false;
    const targetPos = { x: this.pos.x, y: this.pos.y };

    const right = this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
    const left = this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT);
    const up = this.game.input.keyboard.isDown(Phaser.Keyboard.UP);
    const down = this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN);
    const nailedIt = this.game.state.getCurrentState().inputWithinWindow();

    if (!nailedIt) {
      this.movedThisWindow = false;
    }

    if (right && !this.lastRight) {
      tryToMove = true;
      targetPos.x = Math.min(targetPos.x + 1, this.grid.width - 1);
      targetPos.y = this.pos.y;
    }
    if (left && !this.lastLeft) {
      tryToMove = true;
      targetPos.x = Math.max(targetPos.x - 1, 0);
      targetPos.y = this.pos.y;
    }
    if (up && !this.lastUp) {
      tryToMove = true;
      targetPos.x = this.pos.x;
      targetPos.y = Math.max(targetPos.y - 1, 0);
    }
    if (down && !this.lastDown) {
      tryToMove = true;
      targetPos.x = this.pos.x;
      targetPos.y = Math.min(targetPos.y + 1, this.grid.height - 1);
    }

    if (tryToMove) {
      if (nailedIt && !this.movedThisWindow) {
        this.pos = targetPos;
        this.movedThisWindow = true;
      } else {
        // TODO: ooooops you messed up
      }
    }

    this.lastRight = right;
    this.lastLeft = left;
    this.lastUp = up;
    this.lastDown = down;
  }

  draw(graphics, pulse) {
    this.color = ShapeColors[this.grid.getShapeAt(this.pos)];

    const dispPos = this.pos;
    const size = this.grid.squareSize;
    const pixpos = this.grid.gridToPixelPos(dispPos);
    const scaledPulse = pulse * 5;

    graphics.lineStyle(LINEWIDTH, 0xFAFAFA, 1);
    graphics.beginFill(this.color);
    switch (this.grid.getShapeAt(dispPos)) {
      case Shape.SQUARE:
        graphics.drawRect(pixpos.x - size / 2 - scaledPulse / 2,
                          pixpos.y - size / 2 - scaledPulse / 2,
                          size + scaledPulse, size + scaledPulse);
        break;
      case Shape.CIRCLE:
        graphics.drawCircle(pixpos.x, pixpos.y, size + scaledPulse);
        break;
      default:
        break;
    }
    graphics.endFill();
    graphics.lineStyle(0, null, 0);
  }
}

export { PlayerGridEntity, EnemyGridEntity };
