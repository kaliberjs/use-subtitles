import { metadataDefault, subtitlesDefault } from './defaults'
import { useNodeRef } from "./machinery/useNodeRef"
import { toIterable } from './machinery/utilities'
import converters from './machinery/converters'
  
export function useSubtitles({ language, isReady = undefined }) {
  const [state, setState] = React.useState({
    tracks: { [language]: { metadata: [], subtitles: [] } },
    active: { [language]: { metadata: metadataDefault, subtitles: subtitlesDefault } }
  })

  const ref = useNodeRef(
    node => {
      handleInitialLoad(node)
    
      return () => {
        handleUnmount(node)
      }
    },
   [isReady]
  )

  /** @param {HTMLMediaElement} node */
  function handleInitialLoad(node) {
    if (!node) return

    const tracks = toIterable(node.textTracks)

    // Set initial subtitles
    node.addEventListener('loadedmetadata', () => {
      tracks.forEach((x) => setInitialState(x) )
    })

    // Handle cue changes
    tracks.forEach((track) => {
      // A track needs to be hidden in order to obtain its data.
      track.mode = 'hidden'

      track.addEventListener("cuechange", () => {
        handleActive(node, track)
      })
    })
  }

  /** @param {HTMLMediaElement} node */
  function handleUnmount(node) {
    if (!node) return

    toIterable(node.textTracks).forEach((x) => { 
      x.removeEventListener("cuechange", handleActive)
    })
  }

  /** @param {{ kind: TextTrackKind, language: string, cues: TextTrackCueList }} _ */
  function setInitialState({ kind, cues, language }) {
    if (!state.tracks?.[language]?.[kind].length && cues) {
      const data = toIterable(cues)

      setState({ 
        ...state,
        tracks: {
          ...state.tracks,
          [language]: {
            ...(state.tracks[language] ?? {}),
            [kind]: data
          }
        }
      })
    }
  }

  /** @param {HTMLMediaElement} node */
  function handleActive(node, track) {
    if (!node || track.language !== language) return

    const data = toIterable(node.textTracks).reduce(
      (result, x) => ({ 
        ...result, 
        [x.language]: { 
          ...(result[x.language] ?? {}),
          [x.kind]: converters[x.kind](x) 
        } 
      }), 
      {}
    )

    setState({
      ...state,
      active: data
    })
  }

  return {
    subtitles: state.tracks[language]?.subtitles ?? [],
    metadata: state.tracks[language]?.metadata ?? [],
    active: {
      subtitles: state.active[language]?.subtitles ?? subtitlesDefault,
      metadata: state.active[language]?.metadata ?? metadataDefault
    },
    ref
  }
}
