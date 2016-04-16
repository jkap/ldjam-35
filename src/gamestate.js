'use strict';

import { Phaser } from 'phaser';
import { TrackManager } from './track-manager';

import { Shape, Grid } from 'grid';
import { GridEntity } from 'gridentity';

import * as timeUtil from './time-util';

class GameState extends Phaser.State {
  preload() {
    TrackManager.getTrack('track-1', this)
      .then(track => {
        this.track = track;
      });
  }

  create() {
    this.grid = new Grid(3, 8, 75, 10);
    const gridSize = this.grid.getSize();
    this.game.scale.setGameSize(gridSize.width, gridSize.height);

    this.enemy = new GridEntity(this.grid, { x: 0, y: 0 }, 0xFF0000);

    this.graphics = this.game.add.graphics(0, 0);
    window.graphics = this.graphics;
  }

  update() {
    if (this.track && !this.track.sound.isPlaying) {
      this.playTrack(this.track);
    } else if (this.track && this.track.sound.isPlaying) {
      const beat = Math.floor(this.track.sound.currentTime / timeUtil.msPerBeat(this.track.bpm));
      if (beat > this.currentBeat) {
        this.advance();
        this.currentBeat = beat;
      }
    }
  }

  render() {
    this.graphics.clear();

    this.grid.draw(this.graphics);

    this.enemy.draw(this.graphics);
  }

  advance() {
    this.enemy.advance();
  }

  playTrack(track) {
    this.track.sound = this.sound.play(track.key);
    this.currentBeat = 0;
  }
}

export { GameState };
