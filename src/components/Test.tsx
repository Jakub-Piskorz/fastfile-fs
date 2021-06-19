import style from './Test.module.scss'
import {MouseEvent} from 'react'

const Test = () => {
  const menuOnRightClick = (e: MouseEvent) => {
    const contextMenu: HTMLElement | null = document.querySelector(`.${style.contextMenu}`)
    if (!contextMenu) {
      console.error("There's no contextMenu")
      return
    }
    const x = e.nativeEvent.clientX
    const y = e.nativeEvent.clientY
    const isHidden =
      contextMenu.classList.value.search('hidden') === 20 ? true : false
    const isRightClicked = e.nativeEvent.which === 3 ? true : false
    e.preventDefault()
    e.stopPropagation()

    if (isRightClicked) {
      contextMenu.classList.remove(style.hidden)
      console.log(Math.min(x, window.innerWidth))
      console.log(Math.min(y, window.innerHeight))
      contextMenu.style.top = `${Math.min(y, window.innerHeight - 130)}px`
      contextMenu.style.left = `${Math.min(x, window.innerWidth - 180)}px`
    } else contextMenu.classList.add(style.hidden)
  }
  const stop = (e: MouseEvent | null) => {
    if (!e) return
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <main
      className={style.main}
      onMouseUp={menuOnRightClick}
      onContextMenu={stop}
    >
      <h1>Right click me!</h1>
      <div className={`${style.contextMenu} ${style.hidden}`}>
        <ul>
          <li>Download</li>
          <li>Select</li>
          <li>Properties</li>
        </ul>
      </div>
    </main>
  )
}

export default Test
