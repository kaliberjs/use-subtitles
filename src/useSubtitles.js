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
  const onLoadedMetadataEvent = useEvent(handleInitialLoad);

  const memoizedSubtitles = React.useMemo(() => subtitles, [subtitles]);
  
  const [ref, setSubtitleRef] = useCallbackRef({
    onMount: onLoadedMetadataEvent
  })
 
  /** @param {{ textTracks: TextTrackCueList}} */
  function handleInitialLoad({ textTracks }) {
    const currentTrack = toIterable(textTracks).find(
      (x) => x.language === language
    );

    if (currentTrack?.language === language) {
      void currentTrack.addEventListener("cuechange", onCueChangeEvent);
      currentTrack.mode = "hidden";

      return () =>
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

  return {
    subtitles: memoizedSubtitles,
    current: currentSubtitle,
    setSubtitleRef,
    ref
  };
}
