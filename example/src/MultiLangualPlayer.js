import { useSubtitles } from '@kaliber/use-subtitles'

const attributes = {
  controls: true,
  preload: 'auto',
  height: 50,
  width: 350
}

const languages = [
  { code: 'en', flag: '🇬🇧' },
  { code: 'nl', flag: '🇳🇱' },
  { code: 'ja', flag: '🇯🇵' }
]

export function MultiLangualPlayer() {
  const [language, setLanguage] = React.useState('nl')
  const { setSubtitleRef, current } = useSubtitles({
    onRefAvailable: (x) => x.load(),
    language
  })

  return (
    <>
      <div>
        {languages.map(x => (
          <button onClick={() => setLanguage(x.code)}>
            <span role="img">{x.flag}</span>
          </button>
        ))}
      </div>

      <audio ref={setSubtitleRef} {... attributes}>
        <source type="audio/mp3" src="./assets/audio.mp3" />
        <track src="./assets/audio.vtt" kind="subtitles" srcLang="en" />
        <track src="./assets/audio-ja.vtt" kind="subtitles" srcLang="ja" />
        <track src="./assets/audio-nl.vtt" kind="subtitles" srcLang="nl" default />
      </audio>
      <pre>{JSON.stringify(current)}</pre>
      <pre>Language: {language}</pre>{language}
    </>
  )
}
