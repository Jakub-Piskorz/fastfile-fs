import { useStore } from '@/hooks/store'
import style from './Overlay.module.css'
import React, { useEffect, useMemo } from 'react'
import useToggleNav from '@/scripts/toggle-nav'
import cloudIcon from '@/images/cloud-arrow-up.svg'
import MenuState from '@/types/MenuStateEnum'
import OverlayState from '@/types/OverlayStateEnum'
import Button from '@/components/Button/Button'

const Overlay = () => {
  const { overlay, setOverlay, setMenuState } = useStore()

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
      case OverlayState.deleteWarning: {
        return style.clickable
      }
      default: {
        return ''
      }
    }
  }, [overlay])

  const onConfirmDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log('close')
    setOverlay(OverlayState.hidden)
  }

  const isHidden = useMemo(() => {
    return [OverlayState.hidden, OverlayState.sidebar].includes(overlay)

  }, [overlay])

  return (
    <span className={`${style.overlay} ${overlayCssClass}`} onClick={toggleNav}>
      <div
        className={style.uploadWrapper}
        style={{ display: isHidden ? 'none' : 'flex' }}
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        {overlay === OverlayState.upload && <div className={style.uploadBox}>
          <img src={cloudIcon} alt="Upload file icon" />
          <div>Drop your file to upload</div>
        </div>}
        {overlay === OverlayState.deleteWarning && <div className={style.uploadBox}>
          <div>Are you sure you want to delete folder with its content?</div>
          <Button onClick={onConfirmDelete}>Yes</Button>
        </div>}

      </div>
    </span>
  )
}

export default Overlay
