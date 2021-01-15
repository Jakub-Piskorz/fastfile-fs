import style from '@/components/App.module.scss'

const toggleNav = (...items) => {
  document.querySelector('.' + style.sidebar).classList.toggle(style.show)
  document
    .querySelector('.' + style['sidebar-mask'])
    .classList.toggle(style.hidden)
  document.querySelector('.' + style['nav-button']).classList.toggle(style.open)
}

export default toggleNav
