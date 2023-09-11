/** @param {{ text: string }} _*/
export function getVoiceFromCue({ text }) {
  const match = /<v\s+(?<name>[^>]+)>/.exec(text)
  return match?.groups?.name?.trim() ?? null
}

export function toIterable(x) {
  return !x ? [] : [...x]
}
 
export function isJSON(x) {
  try {
    JSON.parse(x)
  } catch (e) {
    return false
  }

  return true
}
