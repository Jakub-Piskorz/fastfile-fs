import style from './CookiePopup.module.scss'
import { useEffect } from 'react'
import CookieScripts from '@/scripts/cookie-scripts'

export default function CookiePopup() {
  useEffect(() => {
    const consentBanner: HTMLElement | null = document.querySelector(
      '.' + style.cookieConsentBanner
    )
    if (consentBanner !== null) {
      consentBanner.style.display =
        CookieScripts.value('consent') === 'aye' ||
        CookieScripts.value('consent') === 'nay'
          ? 'none'
          : 'flex'
    }
  }, [])
  const didConsent = (value: boolean) => {
    const consentBanner: HTMLElement | null = document.querySelector(
      '.' + style.cookieConsentBanner
    )
    if (!consentBanner) return
    consentBanner.style.display = 'none'
    CookieScripts.add('consent', value === true ? 'aye' : 'nay', 100)
  }

  return (
    <div className={style.cookieConsentBanner}>
      <div className={style.cookieConsentBannerInner}>
        <div className={style.cookieConsentBannerCopy}>
          <div className={style.cookieConsentBannerHeader}>
            THIS WEBSITE USES COOKIES
          </div>
          <div className={style.cookieConsentBannerDescription}>
            We use cookies only to save your settings and keep you logged in. We
            don't use them to track you nor give them to any third party
            software. Click below if you consent.
          </div>
        </div>

        <div className={style.cookieConsentBannerActions}>
          <a
            href="#"
            className={style.cookieConsentBannerCta}
            onClick={() => {
              didConsent(true)
            }}
          >
            Accept
          </a>

          <a
            href="#"
            className={`${style.cookieConsentBannerCta} ${style.cookieConsentBannerCtaSecondary}`}
            onClick={() => {
              didConsent(false)
            }}
          >
            Decline
          </a>
        </div>
      </div>
    </div>
  )
}
