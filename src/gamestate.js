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
    this.load.audio('fail-sound', './tracks/fail.m4a');
    this.load.audio('succ-beat-1', './tracks/succ-beat-1.m4a');
    this.load.audio('succ-beat-2', './tracks/succ-beat-2.m4a');
    this.load.audio('succ-beat-3', './tracks/succ-beat-3.m4a');
    this.load.audio('succ-beat-4', './tracks/succ-beat-4.m4a');
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

    this.succSounds = [
      this.sound.add('succ-beat-1'),
      this.sound.add('succ-beat-2'),
      this.sound.add('succ-beat-3'),
      this.sound.add('succ-beat-4'),
    ];

    this.ulost = false;
  }

  update() {
    if (this.track && this.track.sound.isPlaying) {
      const beat = Math.floor(this.track.sound.currentTime / timeUtil.msPerBeat(this.track.bpm));
      if (beat > this.currentBeat) {
        if (beat % 2 === 0) {
          this.advance();
        }
        this.currentBeat = beat;
      }
    }

    // Check collisions
    this.enemies.forEach(enemy => {
      if (enemy.collides(this.player, false)) {
        this.youLose();
      }
      if (enemy.collides(this.player, true)) {
        this.passThrough();
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

  /**
   * Returns a value 0 to 1 based on nearby beats. To be used for pulsating things
   */
  getPulse(bpm = this.track.bpm, beat = this.currentBeat,
           timestamp = this.track.sound.currentTime) {
    return (timestamp - beat * timeUtil.msPerBeat(bpm)) / timeUtil.msPerBeat(bpm);
  }

  render() {
    this.graphics.clear();

    // Do the background color
    this.graphics.beginFill(0x212121);
    this.graphics.drawRect(0, 0, this.game.width, this.game.height);
    this.graphics.endFill();

    if (this.track) {
      this.grid.draw(this.graphics, this.getPulse());
    }

    this.player.draw(this.graphics);
    this.enemies.forEach(enemy => {
      enemy.draw(this.graphics);
    });
  }

  advance() {
    this.enemies.forEach(enemy => {
      enemy.advance(timeUtil.msPerBeat(this.track.bpm));
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

    this.enemies = this.enemies.filter(enemy => enemy.pos.y < 8);
  }

  playTrack(track) {
    this.track.sound = this.sound.play(track.key);
    this.currentBeat = 0;
  }

  youLose() {
    if (!this.ulost) {
      this.ulost = true;
      this.track.sound.stop();
      this.sound.play('fail-sound');
      this.state.restart();
    }
  }

  passThrough() {
    if (!this.succSounds.some(sound => sound.isPlaying)) {
      let currentBeat = this.currentBeat;
      let delay = this.track.sound.currentTime -
        (currentBeat * timeUtil.msPerBeat(this.track.bpm));

      if (delay > 400) {
        delay = this.track.sound.currentTime -
          ((currentBeat++) * timeUtil.msPerBeat(this.track.bpm));
      }
      this.succSounds[currentBeat % 4].play('', delay);
    }
  }
}

export { GameState };
