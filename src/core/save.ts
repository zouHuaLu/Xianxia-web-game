const saveKey = 'xianxia-web-game-save';

export function clearSave() {
  localStorage.removeItem(saveKey);
}

export function readRawSave() {
  return localStorage.getItem(saveKey);
}
