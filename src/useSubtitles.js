import { getVoiceFromCue, toIterable } from './machinery/utilities';
import { useCallbackRef } from "./machinery/useCallbackRef";
import { useEvent } from "./machinery/useEvent";

export function useSubtitles({ language = "nl" }) {
  const [subtitles, setSubtitles] = React.useState([]);
  const [currentSubtitle, setCurrentSubtitle] = React.useState({
    startTime: null,
    endTime: null,
    voice: null,
    text: null
  });

  const onCueChangeEvent = useEvent(handleCueChange);
  const onMountEvent = useEvent(handleInitialLoad);
  const onUnmountEvent = useEvent(handleUnmount);

  const memoizedSubtitles = React.useMemo(() => subtitles, [subtitles]);
  
  const [ref, setSubtitleRef] = useCallbackRef({
    onMount: onMountEvent,
    onUnmount: onUnmountEvent
  })

  /** @param {{ textTracks: TextTrackCueList }} node */
  function handleInitialLoad(node) {
    const currentTrack = getCurrentTrackByLanguage(node?.textTracks)

    if (currentTrack) {
      currentTrack.addEventListener("cuechange", onCueChangeEvent);
      currentTrack.mode = "hidden";
    }
  }
  
  /** @param {{ textTracks: TextTrackCueList }} node */
  function handleUnmount(node) {
    const currentTrack = getCurrentTrackByLanguage(node?.textTracks)

    if (currentTrack) {
      currentTrack.removeEventListener("cuechange", onCueChangeEvent);
    }
  }
 
  /** @param {Event & { target: { cues: TextTrackCueList, activeCues: TextTrackCueList}}} e - generic event */
  function handleCueChange(e) { 
    handleSubtitles({ cues: e.target.cues });
    handleCurrentSubtitle({ cues: e.target.activeCues });
  }

  /** @param {{ cues: TextTrackCueList }} */
  function handleSubtitles({ cues }) {
    if (!subtitles.length && cues) {
      setSubtitles(toIterable(cues));
    }
  }

  /** @param {{ cues: TextTrackCueList }} */
  function handleCurrentSubtitle({ cues }) {
    toIterable(cues).forEach((x) => {
      setCurrentSubtitle({
        text: x.getCueAsHTML().textContent,
        voice: getVoiceFromCue(x.text),
        startTime: x.startTime,
        endTime: x.endTime
      });
    });
  }

  function getCurrentTrackByLanguage(x) {
    return toIterable(x).find(
      (x) => x.language === language
    );
  }

  return {
    subtitles: memoizedSubtitles,
    current: currentSubtitle,
    setSubtitleRef,
    ref
  };
}
