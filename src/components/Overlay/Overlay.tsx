import { OverlayState, useStore } from '@/hooks/store'
import style from './Overlay.module.scss'
import { useMemo } from 'react'
import useToggleNav from '@/scripts/toggle-nav'

const Overlay = () => {
  const { overlay } = useStore()

  const toggleNav = useToggleNav()

  const overlayCssClass = useMemo(() => {
    console.log(overlay)
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
        className={style.uploadBox}
        style={{ display: overlay === OverlayState.upload ? 'flex' : 'none' }}
      >
        Drop your file
      </div>
    </span>
  )
}

export default Overlay
