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
  const [currentSubtitle, setCurrentSubtitle] = React.useState({ 
    [language]: initial
  });

  const onCueChangeEvent = useEvent(handleCueChange);
  const onMountEvent = useEvent(handleInitialLoad);
  const onUnmountEvent = useEvent(handleUnmount);

  const memoizedSubtitles = React.useMemo(() => subtitles[language], [subtitles, language]);
  const memoizedCurrentSubtitle = React.useMemo(() => currentSubtitle[language], [currentSubtitle, language])

  const ref = useCallbackRef({
    onMount: onMountEvent,
    onUnmount: onUnmountEvent
  })

  /** @param {{ textTracks: TextTrackCueList }} node */
  function handleInitialLoad(node) {
    toIterable(node?.textTracks).forEach((x) => {
      if (!subtitles[language].length) {
        setInitialSubtitles(x)
      }
      
      x.addEventListener("cuechange", onCueChangeEvent);
      x.mode = "hidden";
    })
  }
  
  /** @param {{ textTracks: TextTrackCueList }} node */
  function handleUnmount(node) {
    toIterable(node?.textTracks).forEach((x) => {
      x.removeEventListener("cuechange", onCueChangeEvent);
      x.mode = "hidden";
    })
  }

  /** @param {{ language: string, cues: TextTrackCueList }} _ */
  function setInitialSubtitles({ cues, language }) {
    if (!subtitles.length && cues) {
      setSubtitles(x => ({ ...x, [language]: toIterable(cues) }));
    }
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
    ref
  };
}
