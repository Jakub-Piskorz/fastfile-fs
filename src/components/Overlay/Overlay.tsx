import { useStore } from '@/hooks/store'
import style from './Overlay.module.css'
import React, { useCallback, useEffect, useMemo } from 'react'
import useToggleNav from '@/scripts/toggle-nav'
import cloudIcon from '@/images/cloud-arrow-up.svg'
import MenuState from '@/types/MenuStateEnum'
import OverlayState from '@/types/OverlayStateEnum'
import Button from '@/components/Button/Button'
import { useDeleteRecursively } from '@/actions/apiHooks'

const Overlay = () => {
  const { overlay, setMenuState, clickedItem, setOverlay, setClickedItem } = useStore()

  const toggleNav = useToggleNav()
  const deleteRecursively = useDeleteRecursively()

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

  const isHidden = useMemo(() => {
    return [OverlayState.hidden, OverlayState.sidebar].includes(overlay)

  }, [overlay])

  const onBackgroundClick = useCallback(() => {
    toggleNav(true)
  }, [toggleNav])

  const onRecursiveDelete = useCallback(async () => {
    await deleteRecursively(clickedItem!)
    setOverlay(OverlayState.hidden)
    setClickedItem(undefined)
  }, [deleteRecursively, clickedItem])

  const windowClass = useMemo(() => {
    if (overlay === OverlayState.upload) {
      return style.uploadBox
    }
    if (overlay === OverlayState.deleteWarning) {
      return style.box
    }
    return ''
  }, [overlay])

  return (
    <span className={`${style.overlay} ${overlayCssClass}`} onClick={onBackgroundClick}>
      <div
        className={style.uploadWrapper}
        style={{ display: isHidden ? 'none' : 'flex' }}
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        {overlay === OverlayState.upload && <div className={windowClass}>
          <img src={cloudIcon} alt="Upload file icon" />
          <div>Drop your file to upload</div>
        </div>}
        {overlay === OverlayState.deleteWarning && <div className={windowClass}>
          <div>Are you sure you want to delete folder with its content?</div>
          <div className={style.buttons}>
            <Button onClick={onRecursiveDelete}>Yes, delete</Button>
            <Button onClick={() => toggleNav(true)}>No</Button>
          </div>
        </div>}

      </div>
    </span>
  )
}

export default Overlay
