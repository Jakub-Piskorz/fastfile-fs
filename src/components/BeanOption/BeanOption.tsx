import { MouseEventHandler } from 'react'
import style from './BeanOption.module.css'

interface BeanOptionProps {
  name: string
  onDelete?: MouseEventHandler
}

const BeanOption = ({ name, onDelete }: BeanOptionProps) => {
  return <div className={style.bean}>{name}
    <div className={style.x} onClick={onDelete}>x</div>
  </div>
}

export default BeanOption