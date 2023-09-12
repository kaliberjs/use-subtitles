import { useSubtitles } from '@kaliber/use-subtitles'

const attributes = {
  controls: true,
  preload: 'auto',
  height: 50,
  width: 350
}

export function Karaoke() {
  const { ref, active: { metadata, subtitles } } = useSubtitles({
    language: 'en'
  })

  return (
    <>
      <audio {... { ref }} {... attributes}>
        <source type="audio/mp3" src="./assets/audio.mp3" />
        <track src="./assets/audio.vtt" kind="subtitles" srcLang="en" default />
        <track src="./assets/karaoke.vtt" kind="metadata" srcLang="en" />
      </audio>
      <pre>
        {metadata?.text?.split(' ').map((x, i) => (
          <span key={i} style={{ color: x === subtitles?.text ? 'red' : 'black' }}>
            {x}&emsp;
          </span>
        ))}
      </pre>
    </>
  )
}
