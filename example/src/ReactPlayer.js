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
  const reactPlayerRef = React.useRef(null)
  const { setSubtitleRef, current } = useSubtitles({
    language: 'en'
  })

  React.useEffect(
    () => { console.log(`ReactPlayer duration: ${reactPlayerRef.current.getDuration()}`) },
    [reactPlayerRef]
  )

  return (
    <>
      <ReactPlayer
        controls
        ref={reactPlayerRef}
        onReady={x => setSubtitleRef(x.getInternalPlayer())}
        {... { url, config }}
      />
      <pre>{JSON.stringify(current)}</pre>
    </>
  )
}
