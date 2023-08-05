import { useSubtitles } from '@kaliber/use-subtitles'

const attributes = {
  controls: true,
  preload: 'auto',
  height: 50,
  width: 350
}

export function NativeVideoPlayer() {
  const { ref, setSubtitleRef, current } = useSubtitles({
    onPlayerAvailable: (x) => x.load(),
    language: 'en'
  })

  React.useEffect(
    () => { console.log(ref.current.duration) },
    [ref]
  )

  return (
    <>
      <video ref={setSubtitleRef} {... attributes}>
        <source type="audio/mp3" src="./assets/audio.mp3" />
        <track src="./assets/audio.vtt" kind="subtitles" srcLang="en" default />
      </video>
      <pre>{JSON.stringify(current)}</pre>
    </>
  )
}
