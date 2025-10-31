import style from './FilesHeader.module.css'
import { useStore } from '@/hooks/store'

import FilesButtonsUI from '../../components/FilesButtonsUI/FilesButtonsUI'
import folderBlackIcon from '@/images/folder-black.svg'
import searchIcon from '@/images/search-black.svg'
import OverlayState from '@/components/Overlay/OverlayStateEnum'
import { useOverlayStore } from '@/components/Overlay/overlayStore'

const FilesHeader = ({ title }: { title: string }) => {

  const {
    searchedFiles
  } = useStore()
  const { overlay } = useOverlayStore()
  return <div
    className={`${style.uiContainer} ${
      overlay === OverlayState.upload && style.dragging
    }`}
  >
    <h1>
      <img
        className={style.folderBlack}
        src={searchedFiles && searchedFiles.length > 0 ? searchIcon : folderBlackIcon}
        alt="shared file icon"
      />
      <div>{title}</div>
    </h1>
    <FilesButtonsUI />
  </div>
}

export default FilesHeader