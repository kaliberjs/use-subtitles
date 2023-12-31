import App from '/App.universal'
import javascript from '@kaliber/build/lib/javascript'
import stylesheet from '@kaliber/build/lib/stylesheet'

export default (
  <html lang='en'>
    <head>
      <meta charSet='utf-8' />
      <title>@kaliber/use-subtitles</title>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      {javascript}
      {stylesheet}
    </head>
    <body>
      <App />
    </body>
  </html>
)
