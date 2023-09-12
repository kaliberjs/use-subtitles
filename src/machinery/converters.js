import { metadataDefault, subtitlesDefault } from "../defaults"
import { getVoiceFromCue, isJSON } from "./utilities"

function convertToMetadata(track) {
  const activeCue = track.activeCues?.[0]
  if (!activeCue) return metadataDefault

  let text = activeCue?.text ?? null

  if (isJSON(activeCue?.text)) {
    text = JSON.parse(activeCue?.text)
  }

  return {
    text,
    startTime: activeCue?.startTime ?? null,
    endTime: activeCue?.endTime ?? null
  }
}

function convertToSubtitles(track) {
  const activeCue = track.activeCues?.[0]
  if (!activeCue) return subtitlesDefault
  
  return {
    text: activeCue?.getCueAsHTML()?.textContent ?? null,
    voice: activeCue?.text ? getVoiceFromCue({ text: activeCue.text }) : null,
    startTime: activeCue?.startTime ?? null,
    endTime: activeCue?.endTime ?? null
  }
}

const  converters = {
  metadata: convertToMetadata,
  subtitles: convertToSubtitles
}

export default converters
