import style from './App.module.scss'
import { DOMElement, useEffect } from 'react'
import CookieScripts from '@/scripts/cookie-scripts'

export default () => {
  useEffect(() => {
      const consentBanner: HTMLElement | null = document.querySelector('.cookie-consent-banner');
      if (consentBanner !== null) {
        consentBanner.style.display =
      CookieScripts.value('consent') === 'aye' ||
      CookieScripts.value('consent') === 'nay'
        ? 'none'
        : 'flex'
      }
    }, [])
  const didConsent = (value: boolean) => {
    const consentBanner: HTMLElement | null = document.querySelector('.cookie-consent-banner');
    if (!consentBanner) return
    consentBanner.style.display = 'none'
    CookieScripts.add('consent', value === true ? 'aye' : 'nay', 100)
  }

  return (
    <div className="cookie-consent-banner">
      <div className="cookie-consent-banner__inner">
        <div className="cookie-consent-banner__copy">
          <div className="cookie-consent-banner__header">
            THIS WEBSITE USES COOKIES
          </div>
          <div className="cookie-consent-banner__description">
            We use cookies only to save your settings and keep you logged in. We
            don't use them to track you nor give them to any third party
            software. Click below if you consent.
          </div>
        </div>

        <div className="cookie-consent-banner__actions">
          <a
            href="#"
            className="cookie-consent-banner__cta"
            onClick={() => {didConsent(true)}}
          >
            Accept
          </a>

          <a
            href="#"
            className="cookie-consent-banner__cta cookie-consent-banner__cta--secondary"
            onClick={() => {didConsent(false)}}
          >
            Decline
          </a>
        </div>
      </div>
    </div>
  )
}
