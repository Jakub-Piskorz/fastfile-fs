import { MenuState, OverlayState, useStore } from '@/hooks/store'
import style from './Overlay.module.scss'
import { useMemo } from 'react'
import useToggleNav from '@/scripts/toggle-nav'
import cloudIcon from '@/images/cloud-arrow-up.svg'

const Overlay = () => {
  const { overlay, setMenuState, setOverlay } = useStore()

  const toggleNav = useToggleNav()

  const overlayCssClass = useMemo(() => {
    setMenuState(MenuState.closed) // We want to close the context menu, when any overlay change is triggered
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
