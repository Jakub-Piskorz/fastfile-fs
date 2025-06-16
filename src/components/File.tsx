import pdfIcon from '../images/pdf.svg'
import jpgIcon from '../images/jpg.svg'
import mp3Icon from '../images/mp3.svg'
import folderIcon from '../images/folder-black.svg'
import API from '../scripts/API'
import style from './App.module.scss'
import React, { MouseEvent, useEffect, useMemo, useState } from 'react'

interface fileProps {
  name: string
  type: 'file' | 'directory'
  menuHook: any[]
  setMenuHook: (...args: any) => any
  onContextMenu: (...args: any) => any
  mouseUp: (...args: any) => any
}

const File = ({
  name = '',
  type,
  menuHook = [],
  setMenuHook = (...args: any) => {
    console.error('error: setMenuHook not found')
  },
  onContextMenu = (...args: any) => {
    console.error('error: onContextMenu function not found')
  },
  mouseUp = (...args: any) => {
    console.error('error: mouseUp function not found')
  },
}: fileProps) => {
  const icon = useMemo(() => {
    if (type === 'directory') {
      return folderIcon
    }
    const splitName = name.split('.')
    if (splitName.length < 2) return
    const fileFormat = splitName[splitName.length - 1]

    switch (true) {
      case ['jpg', 'jpeg', 'png'].includes(fileFormat):
        return jpgIcon
        break
      case ['pdf'].includes(fileFormat):
        return pdfIcon
        break
      case ['mp3', 'mp4', 'mpeg4'].includes(fileFormat):
        return mp3Icon
    }
  }, [name])

  useEffect(() => console.log(type), [type])

  const [selected, setSelected] = useState<boolean>(false)

  const selectFile = (event: React.MouseEvent) => {
    if (!event) return
    event.stopPropagation()
    event.preventDefault()
    const target = event.target as HTMLElement
    const currentTarget = event.currentTarget as HTMLElement
    // Did user click the select button?
    if (
      target.classList[0] === style.checkmark ||
      target.classList[0] === style.mark
    ) {
      // Is file selected?
      if (currentTarget.classList.contains(style.selected)) {
        // Unselect file.
        setSelected(false)
        currentTarget.classList.remove(style.selected)
        // menuHook.filter(item => item !== name) intended
        let [..._newHook] = [...menuHook] as Array<string>
        if (_newHook.length > 0)
          _newHook = _newHook.filter((file) => file !== name)
        setMenuHook(_newHook)
      } else {
        // Select file.
        setSelected(true)
        currentTarget.classList.add(style.selected)
        // menuHook.add(name) intended
        let [..._newHook] = [...menuHook] as Array<string>
        _newHook.push(name)
        setMenuHook(_newHook)
      }
    }
  }

  const stop = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }

  return (
    <div
      className={style.file}
      onContextMenu={onContextMenu}
      onClick={selectFile}
      onMouseUp={(e: MouseEvent) => {
        mouseUp(e, name)
      }}
    >
      <img src={icon} draggable="false" />
      <p>{name}</p>
      <div className={style.checkmark}>
        <span className={style.mark}>✔</span>
      </div>
    </div>
  )
}

export default File
