import React from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Files from '@/components/Files'

const Main = (props) => {
  return (
    <>
      <Header />
      <main className="fs">
        <Sidebar />
        <Files />
      </main>
    </>
  )
}

export default Main
