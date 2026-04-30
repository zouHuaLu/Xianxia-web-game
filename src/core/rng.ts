export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function chance(probability: number) {
  return Math.random() < probability;
}
