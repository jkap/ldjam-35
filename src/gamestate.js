'use strict';

import { Phaser } from 'phaser';
import { TrackManager } from './track-manager';

import { Grid } from 'grid';

import * as timeUtil from './time-util';

class GameState extends Phaser.State {
  preload() {
    TrackManager.getTrack('track-1', this)
      .then(track => {
        this.track = track;
      });
  }

  create() {
    this.grid = new Grid(3, 7, 100, 10);
    const gridSize = this.grid.getSize();
    this.game.scale.setGameSize(gridSize.width, gridSize.height);

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

    // Draw the grid in the background
    this.graphics.beginFill(0x1c1c1c);
    for (let x = 0; x < this.grid.width; x++) {
      for (let y = 0; y < this.grid.height; y++) {
        const pos = this.grid.gridToPixelPos({ x: x, y: y });
        this.graphics.drawRect(pos.x - this.grid.squareSize / 2, pos.y - this.grid.squareSize / 2,
                               this.grid.squareSize, this.grid.squareSize);
      }
    }
    this.graphics.endFill();
  }

  advance() {
  }

  playTrack(track) {
    this.track.sound = this.sound.play(track.key);
    this.currentBeat = 0;
  }
}

export { GameState };
