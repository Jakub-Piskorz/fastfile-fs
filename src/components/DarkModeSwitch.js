import style from '@/components/App.module.scss'
import sun from '@/images/sun.svg'
import moon from '@/images/moon.svg'

export default ({ changeMode }) => {
  return (
    <div className={style.switch}>
      <img src={moon} id={style.moon} />
      <input type="checkbox" id={style.switchBtn} onClick={changeMode} />
      <label htmlFor={style.switchBtn} id={style.label}>
        Toggle
      </label>
      <img src={sun} id={style.sun} />
    </div>
  )
}
