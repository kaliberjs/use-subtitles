import { useReactPlayerSubtitles } from '@kaliber/use-subtitles'
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
  const { ref, current } = useReactPlayerSubtitles({
    language: 'en'
  })

  return (
    <section>
      <ReactPlayer
        controls
        onReady={ref}
        url="./assets/audio.mp3"
        {... { ref, config }}
      />
      <pre>{JSON.stringify(current)}</pre>
    </section>
  )
}
