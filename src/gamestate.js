'use strict';

import { Phaser } from 'phaser';

import { GridSprite } from 'sprites';
import { Grid } from 'grid';

class GameState extends Phaser.State {
  preload() {
    this.load.image('square', 'images/square.png');
  }

  create() {
    this.grid = new Grid(20, 20, 20, 0);
    this.gridSprite = new GridSprite(this.game, this.grid);
  }

  update() {

  }

  render() {
  }

  advance() {
    this.gridSprite.advance();
  }
}

export { GameState };
