import { useSubtitles } from '@kaliber/use-subtitles'

export function NativeVideoPlayer() {
  const { ref, current } = useSubtitles({
    onPlayerAvailable: (x) => x.load(),
    language: 'en'
  })

  return (
    <section>
      <video preload="auto" controls {... { ref }}>
        <source type="audio/mp3" src="./assets/audio.mp3" />
        <track src="./assets/audio.vtt" kind="subtitles" srcLang="en" default />
      </video>
      <pre>{JSON.stringify(current)}</pre>
    </section>
  )
}
