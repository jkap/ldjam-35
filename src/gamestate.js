'use strict';

import { Phaser } from 'phaser';
import { TrackManager } from './track-manager';

import { HeadSprite, PickUpFriendSprite } from 'sprites';
import { Grid } from 'grid';

import * as timeUtil from './time-util';

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
    this.grid = new Grid(20, 20, 20, 10);
    const gridSize = this.grid.getSize();
    this.game.scale.setGameSize(gridSize.width, gridSize.height);
    this.headSprite = new HeadSprite(this.game, this.grid, 10, 10);

    // Find your friend <3
    this.curFriend = null;

    this.spawnFriend();
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

  }

  advance() {
    this.headSprite.advance();
    if (this.curFriend) {
      if (this.headSprite.gridPos.x === this.curFriend.gridPos.x
       && this.headSprite.gridPos.y === this.curFriend.gridPos.y) {
        this.headSprite.pickUp(this.curFriend.shape);
        this.spawnFriend();
      }
    }
  }

  spawnFriend() {
    const sx = this.game.rnd.integerInRange(0, this.grid.width - 1);
    const sy = this.game.rnd.integerInRange(0, this.grid.height - 1);

    if (!this.curFriend) {
      this.curFriend = new PickUpFriendSprite(this.game, this.grid, sx, sy);
    } else {
      this.curFriend.gridPos.x = sx;
      this.curFriend.gridPos.y = sy;
      this.curFriend.setPos();
      this.curFriend.pickShape();
    }
  }

  playTrack(track) {
    this.track.sound = this.sound.play(track.key);
    this.currentBeat = 0;
  }
}

export { GameState };
