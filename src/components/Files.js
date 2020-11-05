import React from 'react'
import toggleNav from '@/utilities/toggle-nav.js'
import folderBlack from '../images/folder-black.svg'
import pdf from '../images/pdf.svg'
import jpg from '../images/jpg.svg'
import mp3 from '../images/mp3.svg'

const Files = (props) => {
  return (
    <>
      <span className="sidebar-mask hidden" onClick={toggleNav}></span>
      <div className="files-window">
        <h1>
          <img className="folder-black" src={folderBlack} />
          John Smith
          <div className="files">
            <div>
              <img src={jpg} />
              <p>psikut.jpg</p>
            </div>
            <div>
              <img src={pdf} />
              <p>CV.pdf</p>
            </div>
            <div>
              <img src={mp3} />
              <p>psikut-asmr.mp3</p>
            </div>
          </div>
        </h1>
      </div>
    </>
  )
}

export default Files
