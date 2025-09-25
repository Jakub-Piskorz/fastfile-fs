import { MenuState, OverlayState, useStore } from '@/hooks/store'
import style from './Overlay.module.css'
import { useEffect, useMemo } from 'react'
import useToggleNav from '@/scripts/toggle-nav'
import cloudIcon from '@/images/cloud-arrow-up.svg'

const Overlay = () => {
  const { overlay, setMenuState } = useStore()

  const toggleNav = useToggleNav()

  useEffect(() => {
    return setMenuState(MenuState.closed)
  }, [])
  const overlayCssClass = useMemo(() => {
    // We want to close the context menu, when any overlay change is triggered
    // below "if" is unnecessary, but console errors "bad setState() call" on page redirect, if removed. Works fine despite that, but I hate console errors.
    if (overlay !== OverlayState.hidden) {
      setMenuState(MenuState.closed)
    }
    switch (overlay) {
      case OverlayState.hidden: {
        return style.hidden
      }
      case OverlayState.sidebar: {
        return ''
      }
      case OverlayState.upload: {
        return style.upload
      }
    }
  }, [overlay])

  return (
    <span className={`${style.overlay} ${overlayCssClass}`} onClick={toggleNav}>
      <div
        className={style.uploadWrapper}
        style={{ display: overlay === OverlayState.upload ? 'flex' : 'none' }}
      >
        <div className={style.uploadBox}>
          <img src={cloudIcon} alt="Upload file icon" />
          <div>Drop your file to upload</div>
        </div>
      </div>
    </span>
  )
}

export default Overlay
