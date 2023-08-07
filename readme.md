# `@kaliber/use-subtitles`
Easily consume your video elements' WebVTT subtitles in React.

## Motivation
WebVTT subtitles are a great feature, but they come with some difficulties:
- Styling the subtitles with CSS to achieve a consistent look across browsers can be challenging.
- Third party dependencies hide the underlaying `HTMLMediaElement`, and thus;
- Interfacing with the subtitles from JavaScript code is not straightforward.

**This hook aims to make that easier for you.**

## Installation

```
yarn add @kaliber/use-subtitles
```

#### Transpilation

When working with `@kaliber/build`, add `@kaliber/use-subtitles` to your `compileWithBabel` array. 

## Usage
Here's a short example demonstrating the most common use case.


```jsx
import { useSubtitles } from '@kaliber/use-subtitles'

function Component() {
  const { ref, current } = useSubtitles({
    language: "en"
  });

  return (
    <video {... { ref }}>
      <source type="audio/mp3" src="./audio.mp3" />
      <track src="./subtitle.vtt" kind="subtitles" srcLang="en" default />
    </video>
  )
}
```

Look at the [`/example`](/example) directory for further examples.

## Usage with `ReactPlayer`
As long as you are able provide the underlying `HTMLMediaElement` of your dependency, the library should work.

Because `ReactPlayer` only provides the underlaying ref whenever it deems it ready, we need to set it through the `onReady` method (up until that time, its value will otherwise be `null`).

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
  const reactPlayerRef = React.useRef(null);
  const { current, ref } = useSubtitles({
    language: "en"
  });

  return (
    <ReactPlayer
      ref={reactPlayerRef}
      onReady={x => { ref.current = x.getInternalPlayer() }}
      url="./audio.mp3"
      {... { config }}
    />
  )
}
```

## Parameters
The hook accepts the following parameters:

| Key          | Type          | Example | Description   |
| ------------- | ------------- | ------------- | --- |
| `language`  | `string`  | `nl` | Expects a language code that matches the `track` language. Bear in mind this has to be a [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) string. For example in case of Japan, `jp` does not work in all browsers, where `ja` does, which is the valid ISO code.  |

## Return values
The `useSubtitles` hook returns the following values:

| Key            | Description                                                                                                    |
|-----------------|---------------------------------------------------------------------------------------------------------------|
| `subtitles`     | An array of all subtitles available for the specified language.                                              |
| `current`       | An object representing the currently active subtitle, with properties `startTime`, `endTime`, `voice`[^1], and `text`. |
| `ref`           | A reference that should be attached to the player element ref attribute.                                    |

[^1]: `voice` represents the current speakers' name.

## WebVTT
A WebVTT file typically looks like this: 

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

#### Extracted properties
`use-subtitles` extracts some of the available data from the cues. Here's an overview of _what_ it extracts, and how that is returned.

| Kind | Description |
| ---- | ----------- |
| `00:00:00.000 --> 00:00:20.000` | Timestamp. Outputted under `current.startTime` and `currrent.endTime`, and available for all cues in the `subtitles` array. |
| `<v Fred>` | `voice`-tag. Outputted by hook under `current.voice`. |
| `Hi, my name is Fred` | The `text`, available under `current.text`, and available for all cues in the `subtitles` array as `text`. |

---

![](https://media.giphy.com/media/kKJ8YFi1VVhHFudiz2/giphy.gif)

## Disclaimer
This library is intended for internal use, we provide __no__ support, use at your own risk. It does not import React, but expects it to be provided, which [@kaliber/build](https://kaliberjs.github.io/build/) can handle for you.

This library is not transpiled.
