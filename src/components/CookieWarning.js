import style from './App.module.scss'
import { useEffect } from 'react'
import CookieScripts from '@/scripts/cookie-scripts'

export default () => {
  useEffect(() => {
    document.querySelector('.cookie-consent-banner').style.display =
      CookieScripts.value('consent') === 'aye' ||
      CookieScripts.value('consent') === 'nay'
        ? 'none'
        : 'flex'
  }, [])
  const hideIt = () => (banner.style.display = 'none')

  return (
    <div className="cookie-consent-banner">
      <div className="cookie-consent-banner__inner">
        <div className="cookie-consent-banner__copy">
          <div className="cookie-consent-banner__header">
            THIS WEBSITE USES COOKIES
          </div>
          <div className="cookie-consent-banner__description">
            We use cookies only to save your settings and keep you logged it. We
            don't use them to track you nor give them to any third party
            software. Click below if you consent.
          </div>
        </div>

        <div className="cookie-consent-banner__actions">
          <a
            href="#"
            className="cookie-consent-banner__cta"
            onClick={() => {
              document.querySelector('.cookie-consent-banner').style.display =
                'none'
              CookieScripts.add('consent', 'aye', 100)
            }}
          >
            Accept
          </a>

          <a
            href="#"
            className="cookie-consent-banner__cta cookie-consent-banner__cta--secondary"
            onClick={() => {
              document.querySelector('.cookie-consent-banner').style.display =
                'none'
              CookieScripts.add('consent', 'nay', 100)
            }}
          >
            Decline
          </a>
        </div>
      </div>
    </div>
  )
}
