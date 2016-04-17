'use strict';

import { Shape, generateGrid } from './grid-util';

class Grid {
  constructor(width, height, squareSize, spacing, xOffset, level) {
    this.width = width;
    this.height = height;
    this.squareSize = squareSize;
    this.spacing = spacing;
    this.level = level;
    this.xOffset = xOffset;
    this.origin = {
      x: xOffset,
      y: 0,
    };

    this.shapes = [];
    for (const shape of generateGrid(width * height)) {
      this.shapes.push(shape);
    }
  }

  /**
   * Returns the pixel position for the center of the given tile
   */
  gridToPixelPos(pos) {
    const squarePlusSpace = this.squareSize + this.spacing;
    return {
      x: pos.x * squarePlusSpace + squarePlusSpace / 2
         + this.spacing + this.origin.x,
      y: pos.y * squarePlusSpace + squarePlusSpace / 2 + this.spacing + this.origin.y,
    };
  }

  getShapeAt(pos) {
    return this.shapes[pos.y * this.width + pos.x];
  }

  /**
   * Returns true if the given grid position is out of bounds
   */
  outOfBounds(pos) {
    return pos.x >= this.width || pos.x < 0 || pos.y >= this.height || pos.y < 0;
  }

  /**
   * Returns size in pixels
   */
  getSize() {
    const squarePlusSpace = this.squareSize + this.spacing;
    return {
      width: this.width * squarePlusSpace + this.spacing * 2,
      height: this.height * squarePlusSpace + this.spacing * 2,
    };
  }

  draw(graphics, pulse) {
    const scaledPulse = pulse * 5;
    const halfPulse = scaledPulse / 2;
    graphics.beginFill(0xFAFAFA);
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const pos = this.gridToPixelPos({ x: x, y: y });
        if ((this.level === 0 && x === this.width - 1 && y === 0) ||
            (this.level > 0 && x === this.width - 1 && y === 1)) {
          graphics.beginFill(0x009688);
        }
        switch (this.getShapeAt({ x: x, y: y })) {
          case Shape.SQUARE:
            graphics.drawRect(pos.x - this.squareSize / 2 - halfPulse,
                              pos.y - this.squareSize / 2 - halfPulse,
                              this.squareSize + scaledPulse, this.squareSize + scaledPulse);
            break;
          case Shape.CIRCLE:
            graphics.drawCircle(pos.x, pos.y, this.squareSize + scaledPulse);
            break;
          default:
            break;
        }
        if ((this.level === 0 && x === this.width - 1 && y === 0) ||
            (this.level > 0 && x === this.width - 1 && y === 1)) {
          graphics.beginFill(0xFAFAFA);
        }
      }
    }
    graphics.endFill();
  }
}

export { Shape, Grid };
