import { useSubtitles } from '@kaliber/use-subtitles'

const attributes = {
  controls: true,
  preload: 'auto',
  height: 50,
  width: 350
}

export function MultiLangualPlayer() {
  const [language, setLanguage] = React.useState('nl')
  const { setSubtitleRef, current } = useSubtitles({
    onRefAvailable: (x) => x.load(),
    language
  })

  return (
    <>
      <div>
        <button onClick={() => setLanguage('en')}>English</button>
        <button onClick={() => setLanguage('jp')}>Japanese</button>
        <button onClick={() => setLanguage('nl')}>Dutch</button>
      </div>

      <audio ref={setSubtitleRef} {... attributes}>
        <source type="audio/mp3" src="./assets/audio.mp3" />
        <track src="./assets/audio.vtt" kind="subtitles" srcLang="en" />
        <track src="./assets/audio-jp.vtt" kind="subtitles" srcLang="jp" />
        <track src="./assets/audio-nl.vtt" kind="subtitles" srcLang="nl" default />
      </audio>
      <pre>{JSON.stringify(current)}</pre>
      {language}
    </>
  )
}
