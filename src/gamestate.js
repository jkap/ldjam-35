'use strict';

import { Phaser } from 'phaser';
import { TrackManager } from './track-manager';

import { GridSprite } from 'sprites';
import { Grid } from 'grid';

class GameState extends Phaser.State {
  preload() {
    this.load.image('circle', 'images/circle.png');
    this.load.image('triangle', 'images/triangle.png');
    this.load.image('square', 'images/square.png');
    this.load.image('star', 'images/star.png');
    TrackManager.getTrack('track-1', this)
      .then(track => {
        this.track = track;
      });
  }

  create() {
    this.grid = new Grid(20, 20, 20, 0);
    this.gridSprite = new GridSprite(this.game, this.grid);
  }

  update() {
    if (this.track && !this.track.playing) {
      console.log('playing');
      this.track.playing = true;
      this.sound.play(this.track.key);
    }
  }

  render() {
  }

  advance() {
    this.gridSprite.advance();
  }
}

export { GameState };
