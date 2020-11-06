const toggleNav = (...items) => {
  document.querySelector('.sidebar').classList.toggle('show')
  document.querySelector('.sidebar-mask').classList.toggle('hidden')
  document.querySelector('.nav-button').classList.toggle('open')
}

export default toggleNav
