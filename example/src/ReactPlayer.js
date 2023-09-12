import { useSubtitles } from '@kaliber/use-subtitles'
import ReactPlayer from 'react-player'

const url = 'https://archive.org/download/Rick_Astley_Never_Gonna_Give_You_Up/Rick_Astley_Never_Gonna_Give_You_Up.mp4'
const config = {
  file: { tracks: [{
    kind: 'subtitles',
    src: './assets/audio.vtt',
    srcLang: 'en',
    default: true
  }] }
}

export function ReactPlayerComponent() {
  const [isReady, setIsReady] = React.useState(false)
  const reactPlayerRef = React.useRef(null)
  const { ref, active: { subtitles } } = useSubtitles({
    language: 'en',
    isReady
  })

  return (
    <>
      <ReactPlayer
        controls
        ref={reactPlayerRef}
        onReady={x => {
          setIsReady(true)
          ref.current = x.getInternalPlayer()
        }}
        {... { url, config }}
      />
      <pre>{JSON.stringify(subtitles)}</pre>
    </>
  )
}
