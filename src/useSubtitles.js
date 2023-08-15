import { getVoiceFromCue, toIterable } from './machinery/utilities';
import { useCallbackRef } from "./machinery/useCallbackRef";
import { useEvent } from "./machinery/useEvent";

const initial = {
  startTime: null,
  endTime: null,
  voice: null,
  text: null
} 

export function useSubtitles({ language = "nl" }) {
  const [subtitles, setSubtitles] = React.useState({ [language]: [] });
  const [metadata, setMetadata] = React.useState({ [language]: [] });
  const [currentSubtitle, setCurrentSubtitle] = React.useState({ 
    [language]: initial
  });

  const onMetadataChangeEvent = useEvent(handleMetadataChange);
  const onCueChangeEvent = useEvent(handleCueChange);
  const onMountEvent = useEvent(handleInitialLoad);
  const onUnmountEvent = useEvent(handleUnmount);

  const memoizedTracks = React.useMemo(() => subtitles, [subtitles]);
  const memoizedMetadata = React.useMemo(() => metadata, [metadata]);
  const memoizedSubtitles = React.useMemo(() => subtitles[language], [subtitles, language]);
  const memoizedCurrentSubtitle = React.useMemo(() => currentSubtitle[language], [currentSubtitle, language])

  const ref = useCallbackRef({
    onMount: onMountEvent,
    onUnmount: onUnmountEvent
  })

  /** @param {HTMLMediaElement} node */
  function handleInitialLoad(node) {
    toIterable(node?.textTracks).forEach((x) => {
      const hasSubtitles = subtitles[language].length
      const hasMetadata = metadata[language].length
      const isSubtitleTrack = x.kind === 'subtitles'
      const isMetadataTrack = x.kind === 'metadata'

      if (!hasSubtitles && isSubtitleTrack) {
        setInitialSubtitles(x)
      }
      
      if (!hasMetadata && isMetadataTrack) {
        setInitialMetadata(x)
      }

      if (isSubtitleTrack) {
        x.addEventListener("cuechange", onCueChangeEvent);
      }
      
      if (isMetadataTrack) {
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

  /** @param {{ target: { language: string, cues: TextTrackCueList } }} _ */
  function handleMetadataChange({ target }) {
    const cues = toIterable(target.cues).map(x => ({
      text: isJsonString(x.text) ? JSON.parse(x.text) : x.text,
      startTime: x.startTime,
      endTime: x.endTime
    }))

    setMetadata(x => ({ ...x, [target.language]: cues }))
  }
 
  /** @param {{ target: { language: string, cues: TextTrackCueList, activeCues: TextTrackCueList } }} _ */
  function handleCueChange({ target }) { 
    const [cue] = toIterable(target.activeCues).map((x) => ({
      text: x.getCueAsHTML().textContent,
      voice: getVoiceFromCue(x.text),
      startTime: x.startTime,
      endTime: x.endTime
    }))

    setCurrentSubtitle(x => ({ ...x, [target.language]: cue ?? initial }))
  }

  return {
    subtitles: memoizedSubtitles,
    current: memoizedCurrentSubtitle,
    metadata: memoizedMetadata,
    tracks: memoizedTracks,
    ref
  };
}



function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
