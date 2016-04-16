'use strict';

import { Shape } from 'grid';

class GridEntity {
  constructor(grid, pos, color) {
    this.grid = grid;

    // Position on the grid
    this.pos = pos;

    this.color = color;
  }

  advance() {
    this.pos.y++;
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

export { GridEntity };
