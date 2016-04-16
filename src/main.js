'use strict';

import { Phaser } from 'phaser';

import { GameState } from 'gamestate';

const game = new Phaser.Game(800, 600, Phaser.AUTO, '');
game.state.add('Game', GameState, true);

game.advance = (tweenTime) => {
  game.state.getCurrentState().advance(tweenTime);
};

window.game = game;
