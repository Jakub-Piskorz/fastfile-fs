import { Helmet } from 'react-helmet'

const HtmlHead = ({ title = 'Untitled', scripts = null }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge"></meta>
      <script
        src="https://kit.fontawesome.com/0233149bfc.js"
        crossorigin="anonymous"
      ></script>
    </Helmet>
  )
}

export default HtmlHead
