import React from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Files from '@/components/Files'
import HtmlHead from '../scripts/HtmlHead'
import style from '@/style.module.scss'

const App = (props) => {
  return (
    <>
      <HtmlHead title="Fastfile | Your files" />
      <Header />
      <main className={style.fs}>
        <Sidebar />
        <Files />
      </main>
    </>
  )
}

export default App
