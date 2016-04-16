'use strict';

import { Phaser } from 'phaser';

import { HeadSprite, PickUpFriendSprite } from 'sprites';
import { Grid } from 'grid';

class GameState extends Phaser.State {
  preload() {
    this.load.image('circle', 'images/circle.png');
    this.load.image('triangle', 'images/triangle.png');
    this.load.image('square', 'images/square.png');
    this.load.image('star', 'images/star.png');
  }

  create() {
    this.grid = new Grid(20, 20, 20, 0);
    this.headSprite = new HeadSprite(this.game, this.grid, 10, 10);

    // Find your friend <3
    this.curFriend = null;

    this.spawnFriend();
  }

  update() {

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
    const sx = this.game.rnd.integerInRange(0, this.grid.width);
    const sy = this.game.rnd.integerInRange(0, this.grid.height);

    if (!this.curFriend) {
      this.curFriend = new PickUpFriendSprite(this.game, this.grid, sx, sy);
    } else {
      this.curFriend.gridPos.x = sx;
      this.curFriend.gridPos.y = sy;
      this.curFriend.setPos();
      this.curFriend.pickShape();
    }
  }
}

export { GameState };
