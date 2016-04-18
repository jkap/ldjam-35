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
        // this.playTrack(track);
      });
    this.load.audio('fail-sound', './tracks/fail.m4a');
    this.load.audio('succ-beat-1', './tracks/succ-beat-1.m4a');
    this.load.audio('succ-beat-2', './tracks/succ-beat-2.m4a');
    this.load.audio('succ-beat-3', './tracks/succ-beat-3.m4a');
    this.load.audio('succ-beat-4', './tracks/succ-beat-4.m4a');
    this.load.audio('grid-complete', './tracks/grid-complete.m4a');
    this.load.audio('intro-loop', './tracks/intro.m4a');
    this.load.image('logo', './images/logo.png');
  }

  create() {
    this.scoreAreaWidth = 35;

    this.game.stage.backgroundColor = 0x212121;

    this.level = 0;
    this.highScore = parseInt(localStorage.highScore, 10) || 0;

    this.grid = new Grid(3, 2, 75, 10, this.scoreAreaWidth, this.level);
    this.grid.origin = {
      x: this.scoreAreaWidth,
      y: 700 - 190,
    };

    this.game.scale.setGameSize(275 * 2 + this.scoreAreaWidth, 700);
    this.gameSize = Object.assign({}, {
      width: 275,
      height: 700,
    });

    this.player = new PlayerGridEntity(this.game, this.grid, { x: 0, y: 1 }, 0x00FF00);
    this.enemyGenerator = generateEnemy(this.level);
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
    this.isWon = false;

    this.introTrack = this.sound.play('intro-loop', 1, true);
    this.logo = this.add.image(137.5 + this.scoreAreaWidth, 275, 'logo');
    this.logo.anchor = {
      x: 0.5,
      y: 0.5,
    };

    // Add captures so the keys don't scroll the page
    game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT,
      Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.UP,
      Phaser.Keyboard.DOWN,
    ]);
  }

  update() {
    if (!this.track) return;

    if (this.logo.visible) {
      this.logo.scale.set(1 + (this.getPulse() * 0.01));
    }

    if (this.introTrack.isPlaying) {
      const beat = Math.floor(this.introTrack.currentTime / timeUtil.msPerBeat(this.track.bpm));
      if (beat !== this.currentBeat) {
        if (beat % 2 === 1) {
          this.advance();
        }
        this.currentBeat = beat;
      }
    } else if (this.track.sound.isPlaying) {
      const beat = Math.floor(this.track.sound.currentTime / timeUtil.msPerBeat(this.track.bpm));
      if (beat !== this.currentBeat) {
        if (beat % 2 === 1) {
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

    if (this.ulost) {
      return;
    }

    // Check win state
    if ((!this.level && this.player.pos.y === 0 && this.player.pos.x === this.grid.width - 1) ||
        (this.level > 0 && this.player.pos.y === 1 && this.player.pos.x === this.grid.width - 1)) {
      this.handleWin();
    }

    this.player.update();
  }

  inputWithinWindow(bpm = this.track.bpm, beat = this.currentBeat,
                    timestamp = this.track.sound.currentTime || this.introTrack.currentTime) {
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
           timestamp = this.track.sound.currentTime || this.introTrack.currentTime) {
    return ((beat + 1) * timeUtil.msPerBeat(bpm) - timestamp) / timeUtil.msPerBeat(bpm);
  }

  render() {
    this.graphics.clear();

    if (!this.track) return;

    // Do the outline
    const pulse = this.getPulse() * 2;
    const topLeft = {
      x: 2 - pulse + this.scoreAreaWidth,
      y: 2 - pulse,
    };
    const botRight = {
      x: this.scoreAreaWidth + this.gameSize.width - 1 - (2 - pulse),
      y: this.gameSize.height - 1 - (2 - pulse),
    };

    this.graphics.lineStyle(1, 0xFAFAFA, 1);
    this.graphics.moveTo(topLeft.x, topLeft.y);
    this.graphics.lineTo(botRight.x, topLeft.y);
    this.graphics.lineTo(botRight.x, botRight.y);
    this.graphics.lineTo(topLeft.x, botRight.y);
    this.graphics.lineTo(topLeft.x, topLeft.y);
    this.graphics.lineStyle(0, null, 0);

    this.grid.draw(this.graphics, this.getPulse());

    if (this.oldGrid) {
      this.oldGrid.draw(this.graphics, this.getPulse());
    }

    this.player.draw(this.graphics, this.getPulse());
    this.enemies.forEach(enemy => {
      enemy.draw(this.graphics, this.getPulse());
    });

    this.graphics.beginFill(0x212121);
    this.graphics.drawRect(this.gameSize.width + this.scoreAreaWidth, 0,
                           this.game.width, this.game.height);
    this.graphics.endFill();

    this.graphics.beginFill(0x212121);
    this.graphics.drawRect(0, 0, this.scoreAreaWidth, this.game.height);
    this.graphics.endFill();

    // Draw score area
    const spacing = 3;
    const height = 7;

    // High score ~~~ghosts~~~
    let curTop = botRight.y - height + 1;

    this.graphics.beginFill(0x212121);
    this.graphics.lineStyle(1, 0xFAFAFA, 1);
    for (let i = 1; i <= this.highScore; i++) {
      this.graphics.drawRect(0, curTop,
                             this.scoreAreaWidth - 2, height - 1);
      curTop -= height + spacing;
      if (i % 5 === 0) {
        curTop -= height;
      }
    }
    this.graphics.endFill();
    this.graphics.lineStyle(0, null, 0);

    curTop = botRight.y - height + 1;

    this.graphics.beginFill(0xFAFAFA);
    for (let i = 1; i <= this.level; i++) {
      this.graphics.drawRect(0, curTop,
                             this.scoreAreaWidth - 1, height);
      curTop -= height + spacing;
      if (i % 5 === 0) {
        curTop -= height;
      }
    }
    this.graphics.endFill();
  }

  advance() {
    this.enemies.forEach(enemy => {
      enemy.advance(timeUtil.msPerBeat(this.track.bpm));
    });

    const enemies = this.enemyGenerator.next();
    if (enemies.value) {
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
    this.track.sound = this.sound.add(track.key);
    this.track.sound.addMarker('intro', 0, 40, 1, true);
    this.track.sound.addMarker('loop', 40, 64);
    this.track.sound = this.track.sound.play('intro');
    this.track.sound.onMarkerComplete.add(() => {
      this.track.sound = this.track.sound.play('loop');
    });
    this.currentBeat = 0;
  }

  youLose() {
    if (!this.ulost) {
      this.maybeSetHighScore();
      this.ulost = true;
      this.sound.stopAll();
      this.sound.stopAll();
      this.sound.play('fail-sound');
      this.state.restart();
    }
  }

  handleWin() {
    const easing = Phaser.Easing.Circular.InOut;
    if (this.isWon) {
      return;
    }

    this.sound.play('grid-complete');

    this.isWon = true;
    this.level += 1;
    if (this.level === 1) {
      this.introTrack.stop();
      this.playTrack(this.track);
    }
    this.oldGrid = this.grid;
    this.grid = new Grid(3, 8, 75, 10, this.scoreAreaWidth, this.level);
    const gridSize = this.grid.getSize();
    if (this.level === 1) {
      this.grid.origin = {
        x: this.scoreAreaWidth + gridSize.width,
        y: -95,
      };
    } else {
      this.grid.origin = {
        x: this.scoreAreaWidth + gridSize.width,
        y: -gridSize.height + 190,
      };
    }


    this.player.grid = this.grid;
    this.player.pos = {
      x: 0,
      y: 7,
    };

    const tweenTime = timeUtil.msPerBeat(this.track.bpm) * (4 / 3);

    this.game.add.tween(this.gameSize)
      .to({ width: this.gameSize.width * 2 }, tweenTime, easing, true)
      .onComplete.add(() => {
        this.game.add.tween(this.grid.origin)
          .to({ y: 0 }, tweenTime, easing, true)
          .onComplete.add(() => {
            this.game.add.tween(this.grid.origin)
              .to({ x: this.scoreAreaWidth }, tweenTime, easing, true);
            this.game.add.tween(this.gameSize)
              .to({ width: this.gameSize.width / 2 }, tweenTime, easing, true)
              .onComplete.add(() => {
                this.isWon = false;
              });
          });

        this.game.add.tween(this.oldGrid.origin)
          .to({ y: this.oldGrid.origin.y + 510 }, tweenTime, easing, true)
          .onComplete.add(() => {
            this.game.add.tween(this.oldGrid.origin)
              .to({ x: -gridSize.width }, tweenTime, easing, true);
          });
        this.game.add.tween(this.logo)
          .to({ y: this.logo.y + 510 }, tweenTime, easing, true)
          .onComplete.add(() => {
            this.game.add.tween(this.logo)
              .to({ x: this.logo.x - gridSize.width }, tweenTime, easing, true);
          })
      });

    this.enemies = [];
    this.enemyGenerator.return();
    this.enemyGenerator = generateEnemy(this.level);
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

  maybeSetHighScore() {
    const highScore = localStorage.highScore;

    if (highScore) {
      if (parseInt(highScore, 10) < this.level) {
        localStorage.highScore = this.level;
      }
    } else {
      localStorage.highScore = this.level;
    }
  }
}

export { GameState };
