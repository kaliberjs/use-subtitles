import { useSubtitles } from '@kaliber/use-subtitles'

const attributes = {
  controls: true,
  preload: 'auto',
  height: 50,
  width: 350
}

export function NativeVideoPlayer() {
  const { ref, active: { subtitles } } = useSubtitles({
    language: 'en'
  })

  React.useEffect(
    () => {
      console.log(`NativeVideoPlayer src:`, ref.current.currentSrc)
    },
    []
  )

  return (
    <>
      <video {... { ref }} {... attributes}>
        <source type="audio/mp3" src="./assets/audio.mp3" />
        <track src="./assets/audio.vtt" kind="subtitles" srcLang="en" default />
      </video>
      <pre>{JSON.stringify(subtitles)}</pre>
    </>
  )
}
