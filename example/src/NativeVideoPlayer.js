import { useSubtitles } from '@kaliber/use-subtitles'

export function NativeVideoPlayer() {
  const videoRef = React.useRef(null)
  const { current } = useSubtitles({
    onPlayerAvailable: (x) => x?.load(),
    player: videoRef.current,
    language: 'en'
  })

  return (
    <section>
      <video preload="auto" controls ref={videoRef}>
        <source type="audio/mp3" src="./assets/audio.mp3" />
        <track src="./assets/audio.vtt" kind="subtitles" srcLang="en" default />
      </video>
      <pre>{JSON.stringify(current)}</pre>
    </section>
  )
}
