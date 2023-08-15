import { useSubtitles } from '@kaliber/use-subtitles'

const attributes = {
  controls: true,
  preload: 'auto',
  height: 50,
  width: 350
}

export function Karaoke() {
  const { ref, current, tracks, metadata } = useSubtitles({
    language: 'en'
  })

  console.log({ tracks, metadata })

  return (
    <>
      <audio {... { ref }} {... attributes}>
        <source type="audio/mp3" src="./assets/audio.mp3" />
        <track src="./assets/audio.vtt" kind="subtitles" srcLang="en" default />
        <track src="./assets/karaoke.vtt" kind="metadata" srcLang="en" />
      </audio>
      <pre>{JSON.stringify(current)}</pre>
    </>
  )
}
