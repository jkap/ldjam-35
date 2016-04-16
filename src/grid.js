'use strict';

class Grid {
  constructor(width, height, squareSize, spacing) {
    this.width = width;
    this.height = height;
    this.squareSize = squareSize;
    this.spacing = spacing;
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
}

export { Grid };
