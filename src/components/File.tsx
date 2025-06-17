import pdfIcon from '../images/pdf.svg'
import jpgIcon from '../images/jpg.svg'
import mp3Icon from '../images/mp3.svg'
import folderIcon from '../images/folder-black.svg'
import API from '../scripts/API'
import style from './App.module.scss'
import React, { MouseEvent, useEffect, useMemo, useState } from 'react'

interface FileProps {
  name: string
  type: 'file' | 'directory'
  selectedItems: string[]
  setSelectedItems?: React.Dispatch<
    React.SetStateAction<FileProps['selectedItems']>
  >
  onContextMenu: (...args: any) => any
  mouseUp: (...args: any) => any
}

const File = ({
  name = '',
  type,
  selectedItems = [],
  setSelectedItems,
  onContextMenu = (...args: any) => {
    console.error('error: onContextMenu function not found')
  },
  mouseUp = (...args: any) => {
    console.error('error: mouseUp function not found')
  },
}: FileProps) => {
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

  const [isSelected, setIsSelected] = useState<boolean>(false)

  const selectFile = (event: React.MouseEvent) => {
    if (!event || setSelectedItems === undefined) return
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
        setIsSelected(false)
        currentTarget.classList.remove(style.selected)
        setSelectedItems((hook) => hook.filter((file) => file !== name))
      } else {
        // Select file.
        setIsSelected(true)
        currentTarget.classList.add(style.selected)
        setSelectedItems((hook) => [...hook, name])
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
