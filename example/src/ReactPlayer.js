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
  const videoRef = React.useRef(null)
  const { current } = useSubtitles({
    player: videoRef.current?.getInternalPlayer(),
    language: 'en'
  })

  return (
    <section>
      <ReactPlayer
        controls
        ref={videoRef}
        url="./assets/audio.mp3"
        {... { config }}
      />
      <pre>{JSON.stringify(current)}</pre>
    </section>
  )
}
