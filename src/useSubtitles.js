import { useEvent } from "./machinery/useEvent";
import { useEventListener } from "./machinery/useEventListener";

/** 
 * @param {{ 
 *  player: (HTMLVideoElement | HTMLAudioElement), 
 *  language: string, 
 *  onPlayerAvailable: (player: (HTMLVideoElement | HTMLAudioElement)) => void 
 * }}
 * @returns {{ 
 *  subtitles: VTTCue[], 
 *  current: { 
 *    text: string, 
 *    voice: string,
 *    startTime: number,
 *    endTime: number
 *  }
 * }} 
 */
export function useSubtitles({
  player,
  language = "nl",
  onPlayerAvailable = noop
}) {
  const [subtitles, setSubtitles] = React.useState([]);
  const [currentSubtitle, setCurrentSubtitle] = React.useState({ text: null, name: null });

  const onCueChangeEvent = useEvent(handleCueChange);
  const onPlayerReadyEvent = useEvent(onPlayerAvailable);

  const memoizedSubtitles = React.useMemo(() => subtitles, [subtitles]);

  React.useEffect(() => {
    void onPlayerReadyEvent(player);
  }, [player, onPlayerReadyEvent]);

  useEventListener({
    element: player,
    eventName: "loadedmetadata",
    handler: handleInitialLoad
  });

  /** @param {Event & { target: { textTracks: TextTrackCueList }} } e */
  function handleInitialLoad(e) {
    const currentTrack = toIterable(e.target.textTracks).find(
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
    current: currentSubtitle
  };
}

/** @param {{ text: string }} */
function getVoiceFromCue({ text ) {
  const match = /(<v (?<name>.+?)>)/.exec(text);
  return match ? `${match?.groups?.name}` : null;
}

/** @param {TextTrackCueList} x */
function toIterable(x) {
  return !x ? [] : [...x];
}

function noop() {
  return null;
}
