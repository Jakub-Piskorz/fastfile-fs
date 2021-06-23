import { Helmet } from 'react-helmet'
import favicon from '@/images/favicon.ico'

const HtmlHead = ({
  title = 'Untitled',
  scripts = null,
  htmlAttrs = { theme: 'light' },
}) => {
  return (
    <Helmet>
      <html {...htmlAttrs} />
      <title>{title}</title>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge"></meta>
      <link rel="icon" type="img/png" href={favicon} size="32x32" />
      <script
        src="https://kit.fontawesome.com/0233149bfc.js"
        crossorigin="anonymous"
      ></script>
    </Helmet>
  )
}

export default HtmlHead
