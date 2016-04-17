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

export function* generateGrid(num) {
  let i = 0;

  const numEach = num / (Object.keys(Shape).length);
  const bag = [];
  Object.keys(Shape).forEach(shapeName => {
    for (let y = 0; y < numEach; y += 1) {
      bag.push(Shape[shapeName]);
    }
  });

  while (i < num) {
    yield bag.splice(Math.floor(Math.random() * bag.length), 1)[0];
    i++;
  }
}

function _shouldGenEnemy(probability) {
  const dice = Math.random();
  const shapes = [];
  if (dice > probability) {
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

  return [
    new EnemyGridEntity(null, null, { x: 0, y: 0 }, shapes[0]),
    new EnemyGridEntity(null, null, { x: 1, y: 0 }, shapes[1]),
    new EnemyGridEntity(null, null, { x: 2, y: 0 }, shapes[2]),
  ];
}

function getProbabilityEasy(rowsSinceLast) {
  if (rowsSinceLast <= 1) {
    return 0;
  } else if (rowsSinceLast <= 3) {
    return 0.15;
  } else if (rowsSinceLast <= 4) {
    return 0.25;
  } else if (rowsSinceLast <= 5) {
    return 0.75;
  }
  return 1;
}

function getProbabilityMedium(rowsSinceLast) {
  if (rowsSinceLast <= 1) {
    return 0;
  } else if (rowsSinceLast <= 3) {
    return 0.25;
  } else if (rowsSinceLast <= 4) {
    return 0.5;
  } else if (rowsSinceLast <= 5) {
    return 0.75;
  }

  return 1;
}

function getProbabilityHard(rowsSinceLast) {
  if (rowsSinceLast <= 1) {
    return 0;
  } else if (rowsSinceLast <= 4) {
    return 0.5;
  } else if (rowsSinceLast <= 5) {
    return 0.75;
  }

  return 1;
}

function getProbability(level, rowsSinceLast) {
  if (level === 0) {
    return 0;
  } else if (level <= 5) {
    return getProbabilityEasy(rowsSinceLast);
  } else if (level <= 10) {
    return getProbabilityMedium(rowsSinceLast);
  }
  return getProbabilityHard(rowsSinceLast);
}

export function* generateEnemy(level) {
  let rowsSinceLast = 8;

  while (true) {
    rowsSinceLast += 1;

    const probability = getProbability(level, rowsSinceLast);

    const enemies = _shouldGenEnemy(probability);
    if (enemies) {
      rowsSinceLast = 0;
    }

    yield enemies;
  }
}
