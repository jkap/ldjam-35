'use strict';

import { Shape, generateGrid } from './grid-util';

class Grid {
  constructor(width, height, squareSize, spacing) {
    this.width = width;
    this.height = height;
    this.squareSize = squareSize;
    this.spacing = spacing;

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
      x: pos.x * squarePlusSpace + squarePlusSpace / 2 + this.spacing,
      y: pos.y * squarePlusSpace + squarePlusSpace / 2 + this.spacing,
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

  draw(graphics) {
    graphics.beginFill(0xECEFF1);
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const pos = this.gridToPixelPos({ x: x, y: y });
        switch (this.getShapeAt({ x: x, y: y })) {
          case Shape.SQUARE:
            graphics.drawRect(pos.x - this.squareSize / 2, pos.y - this.squareSize / 2,
                              this.squareSize, this.squareSize);
            break;
          case Shape.CIRCLE:
            graphics.drawCircle(pos.x, pos.y, this.squareSize);
            break;
          default:
            break;
        }
      }
    }
    graphics.endFill();
  }
}

export { Shape, Grid };
