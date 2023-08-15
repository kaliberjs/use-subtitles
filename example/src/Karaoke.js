import { useSubtitles } from '@kaliber/use-subtitles'

const attributes = {
  controls: true,
  preload: 'auto',
  height: 50,
  width: 350
}

export function Karaoke() {
  const { ref, current: { metadata, subtitle } } = useSubtitles({
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
        <span dangerouslySetInnerHTML={{
          __html: highlight({ text: metadata.text, word: subtitle.text })
        }} />
      </pre>
    </>
  )

  function highlight({ text, word }) {
    return (text ?? '')
      .split(' ')
      .map(x =>  x === word ? `<b style="color: red;">${x}</b>` : x)
      .join(' ')
  }
}
