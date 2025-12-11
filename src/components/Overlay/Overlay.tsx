import { useStore } from '@/hooks/store'
import style from './Overlay.module.css'
import React, { useCallback, useEffect, useMemo } from 'react'
import useToggleNav from '@/scripts/toggle-nav'
import cloudIcon from '@/images/cloud-arrow-up.svg'
import MenuState from '@/types/MenuStateEnum'
import OverlayState from '@/components/Overlay/OverlayStateEnum'
import Button from '@/components/Button/Button'
import { useDeleteRecursively } from '@/api/utils'
import { useOverlayStore } from '@/components/Overlay/overlayStore'

const Overlay = () => {
  const { setMenuState, clickedItem, setClickedItem } = useStore()
  const { overlay, setOverlay, resolve, data } = useOverlayStore()

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
      case OverlayState.deleteAccountWarning: {
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
    await deleteRecursively(data || clickedItem)
    setOverlay(OverlayState.hidden)
    setClickedItem(undefined)

    // If overlay was called as a promise, resolve it and remove resolver from resolved promise.
    if (resolve) {
      resolve(true)
    }
  }, [deleteRecursively, clickedItem])

  const windowClass = useMemo(() => {
    if (overlay === OverlayState.upload) {
      return style.uploadBox
    }
    if ([OverlayState.deleteWarning, OverlayState.deleteAccountWarning].includes(overlay)) {
      return style.box
    }
    return ''
  }, [overlay])

  const onCancel = () => {
    toggleNav(true)
    // If overlay was called as a promise, resolve it and remove resolver from resolved promise.
    if (resolve) {
      resolve(false)
    }
  }

  const onDeleteAccount = () => {
    toggleNav(true)
    if (resolve) {
      resolve(true)
    }
  }

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
          <div>Are you sure you want to delete the folder {data?.metadata.name || clickedItem?.metadata.name} with its
            content?
          </div>
          <div className={style.buttons}>
            <Button onClick={onRecursiveDelete}>Yes, delete</Button>
            <Button onClick={onCancel}>No</Button>
          </div>
        </div>}
        {overlay === OverlayState.deleteAccountWarning && <div className={windowClass}>
          <div>Are you sure you want to delete your account and all your files?</div>
          <div><strong>Once done, it cannot be reverted!</strong></div>
          <div className={style.buttons}>
            <Button onClick={onDeleteAccount}>DELETE ACCOUNT</Button>
            <Button onClick={onCancel}>Cancel</Button>
          </div>
        </div>}

      </div>
    </span>
  )
}

export default Overlay
