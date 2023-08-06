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
  const memoizedCurrentSubtitle = currentSubtitle[language]

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
 
  /** @param {Event & { target: { language: string, cues: TextTrackCueList, activeCues: TextTrackCueList}}} e - generic event */
  function handleCueChange(e) { 
    handleSubtitles({ language: e.target.language, cues: e.target.cues });
    handleCurrentSubtitle({ language: e.target.language, cues: e.target.activeCues });
  }

  /** @param {{ language: string, cues: TextTrackCueList }} */
  function handleSubtitles({ language, cues }) {
    if (!subtitles.length && cues) {
      setSubtitles(x => ({ ...x, [language]: toIterable(cues) }));
    }
  }

  /** @param {{ language: string, cues: TextTrackCueList }} */
  function handleCurrentSubtitle({ language, cues }) {
    toIterable(cues).forEach((cue) => {
      setCurrentSubtitle(x => ({
        ...x,
        [language]: {
          text: cue.getCueAsHTML().textContent,
          voice: getVoiceFromCue(cue.text),
          startTime: cue.startTime,
          endTime: cue.endTime
        }
      }));
    });
  }

  return {
    subtitles: memoizedSubtitles,
    current: memoizedCurrentSubtitle,
    setSubtitleRef,
    ref
  };
}
