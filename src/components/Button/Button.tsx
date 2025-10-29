import styles from './Button.module.css'
import React from 'react'

interface props {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  children: React.ReactNode,
}

export default function Button({ onClick, children }: props) {
  return <button className={styles.button} onClick={onClick}>{children}</button>
}