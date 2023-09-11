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
  const { ref, active: { subtitles }  } = useSubtitles({
    language
  })

  React.useEffect(
    () => {
      console.log(`MultiLanguagalPlayer src:`, ref.current.currentSrc)
    },
    []
  )

  return (
    <>
      <div>
        {languages.map(x => (
          <button key={x.flag} onClick={() => setLanguage(x.code)}>
            <span role="img">{x.flag}</span>
          </button>
        ))}
      </div>

      <audio {... { ref }} {... attributes}>
        <source type="audio/mp3" src="./assets/audio.mp3" />
        <track src="./assets/audio.vtt" kind="subtitles" srcLang="en" />
        <track src="./assets/audio-ja.vtt" kind="subtitles" srcLang="ja" />
        <track src="./assets/audio-nl.vtt" kind="subtitles" srcLang="nl" default />
      </audio>
      <pre>{JSON.stringify(subtitles)}</pre>
      <pre>Language: {language}</pre>{language}
    </>
  )
}
