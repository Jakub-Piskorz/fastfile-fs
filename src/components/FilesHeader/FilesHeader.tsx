import style from './FilesHeader.module.css'
import { OverlayState, useStore } from '@/hooks/store'

import FilesButtonsUI from '../../components/FilesButtonsUI/FilesButtonsUI'
import folderBlackIcon from '@/images/folder-black.svg'
import searchIcon from '@/images/search-black.svg'

const FilesHeader = ({ title }: { title: string }) => {

  const {
    searchedFiles,
    overlay
  } = useStore()
  return <div
    className={`${style.uiContainer} ${
      overlay === OverlayState.upload && style.dragging
    }`}
  >
    <h1>
      <img
        className={style.folderBlack}
        src={searchedFiles ? searchIcon : folderBlackIcon}
        alt="shared file icon"
      />
      <div>{title}</div>
    </h1>
    <FilesButtonsUI />
  </div>
}

export default FilesHeader