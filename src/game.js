'use strict';

import { Phaser } from 'phaser';

import { GameState } from 'gamestate';

class Game extends Phaser.Game {
  constructor() {
    super(800, 600, Phaser.AUTO, '', GameState);
  }
}

export { Game };
