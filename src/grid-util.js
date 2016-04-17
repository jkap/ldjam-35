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
