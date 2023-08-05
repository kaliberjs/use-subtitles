import { useSubtitles } from '@kaliber/use-subtitles'
import ReactPlayer from 'react-player'

const config = {
  file: { tracks: [{
    kind: 'subtitles',
    src: './assets/audio.vtt',
    srcLang: 'en',
    default: true
  }] }
}

export function ReactPlayerComponent() {
  const reactPlayerRef = React.useRef(null)
  const { setSubtitleRef, current } = useSubtitles({
    language: 'en'
  })

  return (
    <section>
      <ReactPlayer
        controls
        onReady={x => setSubtitleRef(x.getInternalPlayer())}
        ref={reactPlayerRef}
        url="./assets/audio.mp3"
        {... { config }}
      />
      <pre>{JSON.stringify(current)}</pre>
    </section>
  )
}
