import { NativeAudioPlayer } from './NativeAudioPlayer'
import { NativeVideoPlayer } from './NativeVideoPlayer'
import { ReactPlayerComponent } from './ReactPlayer'

import styles from './App.css'

export function App() {
  return (
    <main className={styles.app}>
      <Section>
        <NativeAudioPlayer />
      </Section>

      <Section>
        <NativeVideoPlayer />
      </Section>

      <Section>
        <ReactPlayerComponent />
      </Section>
    </main>
  )
}

function Section({ children }) {
  return (
    <section className={styles.componentSection}>
      {children}
    </section>
  )
}
