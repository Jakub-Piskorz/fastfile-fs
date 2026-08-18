import folderFileIcon from '@/images/folder-file.svg'
import style from './File.module.css'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Routes } from '@/router/router'

type Props = {
  path: string
}

const GoBackFile = ({ path }: Props) => {

  const navigate = useNavigate()

  const onDoubleClick = () => {
    navigate(Routes.app + path)
  }

  const stop = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }

  return (
    <div
      className={style.file}
      onContextMenu={stop}
      onDoubleClick={onDoubleClick}
    >
      <img src={folderFileIcon} draggable="false" alt="Go back" />
      <p>..</p>
    </div>
  )
}

export default GoBackFile
