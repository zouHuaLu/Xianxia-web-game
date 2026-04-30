export const SAVE_KEY = 'xianxia-web-game-save';

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

export function readRawSave() {
  return localStorage.getItem(SAVE_KEY);
}
