'use strict';

import { Phaser } from 'phaser';

class GameState extends Phaser.State {
  advance() {
    // TODO: Implement frame advancement
  }
  preload() {
    this.load.image('logo', 'images/phaser.png');
  }

  create() {
    const logo = this.add.sprite(this.world.centerX, this.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);
  }

  update() {

  }

  render() {

  }
}

export { GameState };
