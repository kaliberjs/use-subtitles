/** @param {{ text: string }} _*/
export function getVoiceFromCue({ text }) {
  const match = /(<v (?<name>.+?)>)/.exec(text)
  return match?.groups?.name ?? null
}

export function toIterable(x) {
  return !x ? [] : [...x];
}

export function noop(x) {
  return null
}

export function isJSON(x) {
  try {
    JSON.parse(x);
  } catch (e) {
    return false;
  }

  return true;
}
