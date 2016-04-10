'use strict';

import { Phaser } from 'phaser';

const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: () => {
    game.load.image('logo', '/images/phaser.png');
  }, create: () => {
    const logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);
  }
});
