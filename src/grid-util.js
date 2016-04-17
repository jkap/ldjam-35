import { EnemyGridEntity } from 'gridentity';

export const Shape = {
  SQUARE: 'SQUARE',
  CIRCLE: 'CIRCLE',
};

export const ShapeColors = {
  SQUARE: 0xFF5722,
  CIRCLE: 0x03A9F4,
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
  const shapes = [];
  console.log(dice, probability);
  if (dice > probability) {
    console.log('no dice');
    return null;
  }

  if (Math.random() > 0.5) {
    // different shapes
    shapes.push(
      Shape[pickRandom(Object.keys(Shape))],
      Shape[pickRandom(Object.keys(Shape))],
      Shape[pickRandom(Object.keys(Shape))],
    );
  } else {
    // same shapes
    const shape = Shape[pickRandom(Object.keys(Shape))];
    shapes.push(shape, shape, shape);
  }

  console.log('generating');

  return [
    new EnemyGridEntity(null, null, { x: 0, y: 0 }, shapes[0]),
    new EnemyGridEntity(null, null, { x: 1, y: 0 }, shapes[1]),
    new EnemyGridEntity(null, null, { x: 2, y: 0 }, shapes[2]),
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
