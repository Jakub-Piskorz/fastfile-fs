import { Helmet } from 'react-helmet-async'

const HtmlHead = ({
                    title = 'Untitled',
                    htmlAttrs = { theme: 'light' }
                  }) => {
  return (
    <Helmet htmlAttributes={htmlAttrs}>
      <title>{title}</title>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge"></meta>
    </Helmet>
  )
}

export default HtmlHead
