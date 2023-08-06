import { NativeAudioPlayer } from './NativeAudioPlayer'
import { NativeVideoPlayer } from './NativeVideoPlayer'
import { MultiLangualPlayer } from './MultiLangualPlayer'
import { ReactPlayerComponent } from './ReactPlayer'

import styles from './App.css'

export function App() {
  return (
    <main className={styles.app}>
      <Section title="Native Audio Player">
        <NativeAudioPlayer />
      </Section>

      <Section title="Native Video Player">
        <NativeVideoPlayer />
      </Section>

      <Section title="Multi Languagal Player">
        <MultiLangualPlayer />
      </Section>

      <Section title="ReactPlayer">
        <ReactPlayerComponent />
      </Section>
    </main>
  )
}

function Section({ title, children }) {
  return (
    <section className={styles.componentSection}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.container}>
        {children}
      </div>
    </section>
  )
}
