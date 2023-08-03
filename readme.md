# BEFORE YOU PUBLISH
- Read [Libraries van Kaliber](https://docs.google.com/document/d/1FrJi-xWtKkbocyMVK5A5_hupjl5E4gD4rDvATDlxWyc/edit#heading=h.bb3md3gyf493).
- Make sure your example works.
- Remove 'BEFORE YOU PUBLISH' and 'PUBLISHING' from this document.

# PUBLISHING
- Make sure you are added to the kaliber organization on NPM
- run `yarn publish`
- Enter a correct version, we adhere to semantic versioning (semver)
- run `git push`
- run `git push --tags`
- Send everybody an email to introduce them to your library!


# `@kaliber/use-subtitles`
Short description.

## Motivation
Optionally add a bit of text describing why this library exists.

## Installation

```
yarn add @kaliber/use-subtitles
```

## Usage
Short example. If your library has multiple ways to use it, show the most used one and refer to `/example` for further examples.

### Examples

#### With Native `HTMLVideoElement`
```jsx
import { useSubtitles } from '@kaliber/use-subtitles'

function Component() {
  const videoRef = React.useRef(null);
  const { current } = useSubtitles({
    onPlayerReady: (x) => x.load(),
    player: videoRef.current,
    language: "en"
  });

  return (
    <video ref={videoRef}>
      <source type="audio/mp3" src="./audio.mp3" />
      <track src="./output.vtt" kind="subtitles" srcLang="en" default />
    </video>
  )
}
```

#### With Native `HTMLAudioElement`
```jsx
import { useSubtitles } from '@kaliber/use-subtitles'

function Component() {
  const audioRef = React.useRef(null);
  const { current } = useSubtitles({
    onPlayerReady: (x) => x.load(),
    player: audioRef.current,
    language: "en"
  });

  return (
    <audio ref={audioRef}>
      <source type="audio/mp3" src="./audio.mp3" />
      <track src="./output.vtt" kind="subtitles" srcLang="en" default />
    </audio>
  )
}
```

#### With `ReactPlayer`
```jsx
import { useSubtitles } from '@kaliber/use-subtitles'

function Component() {
  const videoRef = React.useRef(null);
  const { current } = useSubtitles({
    player: videoRef.current?.getInternalPlayer(),
    language: "en"
  });

  const config = {
    file: {
      tracks: [
        {
          kind: "subtitles",
          src: "/output.vtt",
          srcLang: "en",
          default: true
        }
      ]
    }
  }

  return (
    <ReactPlayer
      ref={videoRef}
      url="./audio.mp3"
      {... { config }}
    />
  )
}
```

## Tips & Gotcha's

### Use `<video />` over `<audio />`
The support for using `<track />` in `<video />` is better than it is for `<audio />`.


![](https://media.giphy.com/media/find-a-good-gif/giphy.gif)

## Disclaimer
This library is intended for internal use, we provide __no__ support, use at your own risk. It does not import React, but expects it to be provided, which [@kaliber/build](https://kaliberjs.github.io/build/) can handle for you.

This library is not transpiled.
