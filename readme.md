# `@kaliber/use-subtitles`
Easily consume your video elements' WebVTT subtitles in React.

## Motivation
WebVTT subtitles are lovely! However; 
- the default styling (through CSS) is hard to get right across all browsers
- it's hard to interface with the subtitles from JavaScript code

This hook aims to make that easier for you.

## Installation

```
yarn add @kaliber/use-subtitles
```

#### Transpilation

When working with `@kaliber/build`, add `@kaliber/use-subtitles` to your `compileWithBabel` array. 

## Usage
Short example. If your library has multiple ways to use it, show the most used one and refer to `/example` for further examples.

```jsx
import { useSubtitles } from '@kaliber/use-subtitles'

function Component() {
  const videoRef = React.useRef(null);
  const { current } = useSubtitles({
    onPlayerAvailable: (x) => x.load(),
    player: videoRef.current,
    language: "en"
  });

  return (
    <video ref={videoRef}>
      <source type="audio/mp3" src="./audio.mp3" />
      <track src="./subtitle.vtt" kind="subtitles" srcLang="en" default />
    </video>
  )
}
```

## Usage with `ReactPlayer`
`use-subtitles` aims to be player-agnostic; as long as you provide the underlaying `HTMLVideoPlayer` of your dependency, the library intends to work.

```jsx
import { useSubtitles } from '@kaliber/use-subtitles'
import ReactPlayer from 'react-player'

const config = {
  file: { tracks: [{
    kind: "subtitles",
    src: "/subtitle.vtt",
    srcLang: "en",
    default: true
  }]}
}

function Component() {
  const videoRef = React.useRef(null);
  const { current } = useSubtitles({
    player: videoRef.current?.getInternalPlayer(),
    language: "en"
  });

  return (
    <ReactPlayer
        ref={videoRef}
        url="./audio.mp3"
        {... { config }}
      />
  )
}
```

## Parameters
| Name          | Type          | Description   |
| ------------- | ------------- | ------------- |
| `player`      | `HTMLVideoElement \| HTMLAudioElement` | A native audio or video element. Can also be supplied from an underlaying element in a third party player like `ReactPlayer` (e.g. through the use of the `getInternalPlayer()` method). |
| `language`  | `string`  | Expects a language code that matches the `track` language.  |
| `onPlayerAvailable`  | `(HTMLVideoElement \| HTMLAudioElement) => void`  | A callback to indicate the `player` is available; can you used to `load()` a native `video` element. |

## Return values
The hook returns and object with;
- **`subtitles`** (an array with all subtitles)
- **`current`** (only the current subtitle)

Here's an overview of what these keys contain:

---

#### `subtitles`
Forwards all keys from the subtitle track as [VTTCue](https://developer.mozilla.org/en-US/docs/Web/API/VTTCue)'s, which inherits from [TextTrackCues](https://developer.mozilla.org/en-US/docs/Web/API/TextTrackCue). Read more about [VTTCue](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API#vttcue)'s at MDN.

---

#### `current`
| Key | Type | Description |
| --- | ---- | ----------- |
| `text` | `string` | Returns the current `text` (including any [markup tags](https://www.w3.org/TR/webvtt1/#webvtt-internal-node-object) it main contain). | 
| `voice` | `string` | The name of the current speaker (called `voice` in `WebVTT`). |
| `startTime` | `number` | The start time of the current cue. | 
| `endTime` | `number` | The end time of the current cue. |

## WebVTT
Here's a quick glance at a `WebVTT` file.
`use-subtitles` extracts some of the available data from the cues. Here's an overview of _what_ it extracts, and how that is returned.

| Kind | Description |
| ---- | ----------- |
| `00:00:00.000 --> 00:00:20.000` | Timestamp. Outputted under `current.startTime` and `currrent.endTime`, and available for all cues in the `subtitles` array. |
| `<v Fred>` | `voice`-tag. Outputted by hook under `current.speaker`. |
| `Hi, my name is Fred` | The `text`, available under `current.text`, and available for all cues in the `subtitles` array as `text`. |

```vtt
WEBVTT

00:00:00.000 --> 00:00:20.000
<v Fred>Hi, my name is Fred

00:00:02.500 --> 00:00:22.500
<v Bill>Hi, I’m Bill

00:00:05.000 --> 00:00:25.000
<v Fred>Would you like to get a coffee?

00:00:07.500 --> 00:00:27.500
<v Bill>Sure! I’ve only had one today.

00:00:10.000 --> 00:00:30.000
<v Fred>This is my fourth!

00:00:12.500 --> 00:00:32.500
<v Fred>OK, let’s go.
```

## Tips & Gotcha's

### Use `video` over `audio`
The support for using `track` as a child element in `video` is better than it is for `audio`.

---

![](https://media.giphy.com/media/kKJ8YFi1VVhHFudiz2/giphy.gif)

## Disclaimer
This library is intended for internal use, we provide __no__ support, use at your own risk. It does not import React, but expects it to be provided, which [@kaliber/build](https://kaliberjs.github.io/build/) can handle for you.

This library is not transpiled.
