import { getVoiceFromCue, isJSON, toIterable } from './machinery/utilities';
import { initial, initialCurrentSubtitle } from './defaults';
import { useCallbackRef } from "./machinery/useCallbackRef";
import { useEvent } from "./machinery/useEvent";

export function useSubtitles({ language }) {
  const [subtitles, setSubtitles] = React.useState({ [language]: [] });
  const [metadata, setMetadata] = React.useState({ [language]: [] });
  const [currentSubtitle, setCurrentSubtitle] = React.useState({ [language]: initialCurrentSubtitle });
  const [currentMetadata, setcurrentMetadata] = React.useState({ [language]: initial });

  const onMetadataChangeEvent = useEvent(handleMetadataChange);
  const onCueChangeEvent = useEvent(handleCueChange);
  const onMountEvent = useEvent(handleInitialLoad);
  const onUnmountEvent = useEvent(handleUnmount);

  const memoizedMetadata = React.useMemo(() => metadata, [metadata]);
  const memoizedSubtitles = React.useMemo(() => subtitles[language], [subtitles, language]);
  const memoizedCurrentMetadata = React.useMemo(() => currentMetadata[language], [currentMetadata, language]);
  const memoizedCurrentSubtitle = React.useMemo(() => currentSubtitle[language], [currentSubtitle, language])

  const ref = useCallbackRef({
    onMount: onMountEvent,
    onUnmount: onUnmountEvent
  })

  /** @param {HTMLMediaElement} node */
  function handleInitialLoad(node) {
    const tracks = toIterable(node?.textTracks)

    // Set initial subtitles
    node?.addEventListener('loadedmetadata', () => {
      tracks.forEach((x) => {
        const hasSubtitles = subtitles[language].length
        const hasMetadata = metadata[language].length

        if (!hasSubtitles && x.kind === 'subtitles') {
          setInitialSubtitles(x)
        }
        
        if (!hasMetadata && x.kind === 'metadata') {
          setInitialMetadata(x)
        }
      })
    })

    // Handle cue changes
    tracks.forEach((x) => {
      if (x.kind === 'subtitles') {
        x.addEventListener("cuechange", onCueChangeEvent);
      }
      
      if (x.kind === 'metadata') {
        x.addEventListener("cuechange", onMetadataChangeEvent);
      }

      x.mode = "hidden";
    })
  }
  
  /** @param {HTMLMediaElement} node */
  function handleUnmount(node) {
    toIterable(node?.textTracks).forEach((x) => {
      x.removeEventListener("cuechange", onCueChangeEvent);
    })
  }

  /** @param {{ language: string, cues: TextTrackCueList }} _ */
  function setInitialSubtitles({ cues, language }) {
    if (!subtitles.length && cues) {
      setSubtitles(x => ({ ...x, [language]: toIterable(cues) }));
    }
  }

  /** @param {{ language: string, cues: TextTrackCueList }} _ */
  function setInitialMetadata({ cues, language }) {
    if (!metadata.length && cues) {
      setMetadata(x => ({ ...x, [language]: toIterable(cues) }));
    }
  }

  /** @param {{ target: { language: string, activeCues: TextTrackCueList } }} _ */
  function handleMetadataChange({ target }) {
    const [cue] = toIterable(target.activeCues).map(x => ({
      text: isJSON(x.text) ? JSON.parse(x.text) : x.text,
      startTime: x.startTime,
      endTime: x.endTime
    }))

    setcurrentMetadata(x => ({ ...x, [target.language]: cue ?? initial }))
  }
 
  /** @param {{ target: { language: string, activeCues: TextTrackCueList } }} _ */
  function handleCueChange({ target }) { 
    const [cue] = toIterable(target.activeCues).map((x) => ({
      text: x.getCueAsHTML().textContent,
      voice: getVoiceFromCue(x.text),
      startTime: x.startTime,
      endTime: x.endTime
    }))

    setCurrentSubtitle(x => ({ ...x, [target.language]: cue ?? initialCurrentSubtitle }))
  }

  return {
    subtitles: memoizedSubtitles,
    metadata: memoizedMetadata,
    current: {
      subtitle: memoizedCurrentSubtitle,
      metadata: memoizedCurrentMetadata
    },
    ref
  };
}
