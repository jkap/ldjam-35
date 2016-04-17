import { EnemyGridEntity } from 'gridentity';

export const Shape = {
  SQUARE: 'SQUARE',
  CIRCLE: 'CIRCLE',
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function* generateGrid(num, difficulty) {
  let i = 0;

  while (i < num) {
    yield Shape[pickRandom(Object.keys(Shape))];
    i++;
  }
}

function _shouldGenEnemy(probability) {
  const dice = Math.random();
  console.log(dice, probability);
  if (dice > probability) {
    console.log('no dice');
    return null;
  }

  console.log('generating');

  return [
    new EnemyGridEntity(null, null, { x: 0, y: 0 }, 0xFF0000),
    new EnemyGridEntity(null, null, { x: 1, y: 0 }, 0xFF0000),
    new EnemyGridEntity(null, null, { x: 2, y: 0 }, 0xFF0000),
  ];
}

export function* generateEnemy() {
  let rowsSinceLast = 8;
  let probability;

  while (true) {
    rowsSinceLast += 1;

    console.log(rowsSinceLast);

    if (rowsSinceLast <= 1) {
      yield null;
      continue;
    } else if (rowsSinceLast <= 2) {
      probability = 0.05;
    } else if (rowsSinceLast <= 3) {
      probability = 0.1;
    } else if (rowsSinceLast <= 4) {
      probability = 0.25;
    } else if (rowsSinceLast <= 5) {
      probability = 0.5;
    } else if (rowsSinceLast <= 6) {
      probability = 0.75;
    } else {
      probability = 1;
    }

    const enemies = _shouldGenEnemy(probability);
    if (enemies) {
      rowsSinceLast = 0;
    }

    yield enemies;
  }
}
