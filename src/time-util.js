export function msPerBeat(bpm) {
  return (1 / bpm) * 60 * 1000;
}

export function* delays(bpm, duration) {
  let delay = 0;
  while (delay / 1000 < duration) {
    yield delay;
    delay += msPerBeat(bpm);
  }
}
