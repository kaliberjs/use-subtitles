import { useSubtitles } from '@kaliber/use-subtitles'

const attributes = {
  controls: true,
  preload: 'auto',
  height: 50,
  width: 350
}

export function NativeAudioPlayer() {
  const { ref, current } = useSubtitles({
    onRefAvailable: (x) => x.load(),
    language: 'en'
  })

  React.useEffect(
    () => console.log(`NativeAudioPlayer src:`, ref.current.currentSrc),
    []
  )

  return (
    <>
      <audio {... { ref }} {... attributes}>
        <source type="audio/mp3" src="./assets/audio.mp3" />
        <track src="./assets/audio.vtt" kind="subtitles" srcLang="en" default />
      </audio>
      <pre>{JSON.stringify(current)}</pre>
    </>
  )
}
