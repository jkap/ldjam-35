'use strict';

import { Phaser } from 'phaser';
import { TrackManager } from './track-manager';

import { Grid } from 'grid';
import { PlayerGridEntity, EnemyGridEntity } from 'gridentity';

import * as timeUtil from './time-util';

class GameState extends Phaser.State {
  preload() {
    TrackManager.getTrack('track-1', this)
      .then(track => {
        this.track = track;
        this.playTrack(track);
      });
  }

  create() {
    this.grid = new Grid(3, 8, 75, 10);
    const gridSize = this.grid.getSize();
    this.game.scale.setGameSize(gridSize.width, gridSize.height);

    this.player = new PlayerGridEntity(this.game, this.grid, { x: 0, y: 7 }, 0x00FF00);
    this.enemy = new EnemyGridEntity(this.game, this.grid, { x: 0, y: 0 }, 0xFF0000);

    this.graphics = this.game.add.graphics(0, 0);
    window.graphics = this.graphics;
  }

  update() {
    if (this.track && this.track.sound.isPlaying) {
      const beat = Math.floor(this.track.sound.currentTime / timeUtil.msPerBeat(this.track.bpm));
      if (beat > this.currentBeat) {
        if (beat % 4 === 0) {
          this.advance();
        }
        this.currentBeat = beat;
      }
    }

    this.player.update();
  }

  inputWithinWindow(bpm = this.track.bpm, beat = this.currentBeat,
                    timestamp = this.track.sound.currentTime) {
    console.log(bpm, beat, timestamp);
    const beatWindow = 75;

    function comp(_beat) {
      const upper = _beat * timeUtil.msPerBeat(bpm) + beatWindow;
      const lower = _beat * timeUtil.msPerBeat(bpm) - beatWindow;
      return (timestamp >= lower && timestamp <= upper);
    }

    return comp(beat) || comp(beat + 1);
  }

  render() {
    this.graphics.clear();

    this.grid.draw(this.graphics);

    this.player.draw(this.graphics);
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
