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
    return {
      x: pos.x * this.squareSize + this.squareSize / 2,
      y: pos.y * this.squareSize + this.squareSize / 2,
    };
  }

  /**
   * Returns true if the given grid position is out of bounds
   */
  outOfBounds(pos) {
    return pos.x >= this.width || pos.x < 0 || pos.y >= this.height || pos.y < 0;
  }
}

export { Grid };
