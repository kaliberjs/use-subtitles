import { useSubtitles } from '@kaliber/use-subtitles'

export function NativeAudioPlayer() {
  const { ref, current } = useSubtitles({
    onPlayerAvailable: (x) => x.load(),
    language: 'en'
  })

  return (
    <section>
      <audio preload="auto" controls {... { ref }}>
        <source type="audio/mp3" src="./assets/audio.mp3" />
        <track src="./assets/audio.vtt" kind="subtitles" srcLang="en" default />
      </audio>
      <pre>{JSON.stringify(current)}</pre>
    </section>
  )
}
