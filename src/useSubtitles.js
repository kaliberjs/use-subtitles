import { getVoiceFromCue, toIterable } from './machinery/utilities';
import { useCallbackRef } from "./machinery/useCallbackRef";
import { useEvent } from "./machinery/useEvent";

export function useSubtitles({ language = "nl" }) {
  const [subtitles, setSubtitles] = React.useState({ [language]: [] });
  const [currentSubtitle, setCurrentSubtitle] = React.useState({ 
    [language]: {
      startTime: null,
      endTime: null,
      voice: null,
      text: null
    }
  });

  const onCueChangeEvent = useEvent(handleCueChange);
  const onMountEvent = useEvent(handleInitialLoad);
  const onUnmountEvent = useEvent(handleUnmount);

  const memoizedSubtitles = React.useMemo(() => subtitles[language], [subtitles, language]);
  const memoizedCurrentSubtitle = React.useMemo(() => currentSubtitle[language], [currentSubtitle, language])

  const [ref, setSubtitleRef] = useCallbackRef({
    onMount: onMountEvent,
    onUnmount: onUnmountEvent
  })

  /** @param {{ textTracks: TextTrackCueList }} node */
  function handleInitialLoad(node) {
    toIterable(node?.textTracks).forEach((x) => {
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
 
  /** @param {{ target: { language: string, cues: TextTrackCueList, activeCues: TextTrackCueList } }} */
  function handleCueChange({ target }) { 
    handleSubtitles({ language: target.language, cues: target.cues });
    handleCurrentSubtitle({ language: target.language, cues: target.activeCues });
  }

  /** @param {{ language: string, cues: TextTrackCueList }} */
  function handleSubtitles({ language, cues }) {
    if (!subtitles.length && cues) {
      setSubtitles(x => ({ ...x, [language]: toIterable(cues) }));
    }
  }

  /** @param {{ language: string, cues: TextTrackCueList }} */
  function handleCurrentSubtitle({ language, cues }) {
    const [cue] = toIterable(cues).map((x) => ({
      text: x.getCueAsHTML().textContent,
      voice: getVoiceFromCue(x.text),
      startTime: x.startTime,
      endTime: x.endTime
    }))

    setCurrentSubtitle(x => ({ ...x, [language]: cue }))
  }

  return {
    subtitles: memoizedSubtitles,
    current: memoizedCurrentSubtitle,
    setSubtitleRef,
    ref
  };
}
