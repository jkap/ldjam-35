'use strict';

import { Phaser } from 'phaser';
import { TrackManager } from './track-manager';

import { Grid } from 'grid';
import { PlayerGridEntity } from 'gridentity';

import { generateEnemy } from './grid-util';

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
    this.enemyGenerator = generateEnemy();
    this.enemies = [];

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

    // Check collisions
    this.enemies.forEach(enemy => {
      if (enemy.pos.x === this.player.pos.x && enemy.pos.y === this.player.pos.y) {
        // On the same tile, are you the same shape?
        if (enemy.shape !== this.grid.getShapeAt(enemy.pos)) {
          this.youLose();
        }
      }
    });

    this.player.update();
  }

  inputWithinWindow(bpm = this.track.bpm, beat = this.currentBeat,
                    timestamp = this.track.sound.currentTime) {
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

    // Do the background color
    this.graphics.beginFill(0x212121);
    this.graphics.drawRect(0, 0, this.game.width, this.game.height);
    this.graphics.endFill();

    this.grid.draw(this.graphics);

    this.player.draw(this.graphics);
    this.enemies.forEach(enemy => {
      enemy.draw(this.graphics);
    });
  }

  advance() {
    this.enemies.forEach(enemy => {
      enemy.advance();
    });

    const enemies = this.enemyGenerator.next();
    if (enemies.value !== null) {
      this.enemies = this.enemies.concat(enemies.value.map(enemy => {
        Object.assign(enemy, {
          game: this.game,
          grid: this.grid,
        });
        return enemy;
      }));
    }
  }

  playTrack(track) {
    this.track.sound = this.sound.play(track.key);
    this.currentBeat = 0;
  }

  youLose() {
    // TODO ????
    console.log('*sad trombone sound*');
  }
}

export { GameState };
