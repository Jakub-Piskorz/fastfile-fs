import React, { useEffect, useState } from 'react'
import toggleNav from '@/scripts/toggle-nav.js'
import API from '@/scripts/API.js'
import File from './File'
import folderBlack from '../images/folder-black.svg'

const Files = (props) => {
  const [files, setFiles] = useState(false)
  useEffect(() => {
    API.read(`qbek`).then((response) => setFiles(response))
    console.log(props)
  }, [1000])

  return (
    <>
      <span className="sidebar-mask hidden" onClick={toggleNav}></span>
      <div className="files-window">
        <h1>
          <img className="folder-black" src={folderBlack} />
          John Smith
        </h1>
        <div className="files">
          {files
            ? files.data.map((file, i) => (
                <File name={file.name.slice(0, 20)} type={file.type} key={i} />
              ))
            : 'Loading...'}
        </div>
      </div>
    </>
  )
}

export default Files
