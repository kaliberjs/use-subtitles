import { NativeAudioPlayer } from './NativeAudioPlayer'
import { NativeVideoPlayer } from './NativeVideoPlayer'
import { ReactPlayerComponent } from './ReactPlayer'

export function App() {
  return (
    <main>
      <NativeAudioPlayer />
      <NativeVideoPlayer />
      <ReactPlayerComponent />
    </main>
  )
}
