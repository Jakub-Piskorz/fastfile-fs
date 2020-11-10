import React from 'react'
import pdf from '../images/pdf.svg'
import jpg from '../images/jpg.svg'
import mp3 from '../images/mp3.svg'
import API from '../scripts/API'

const File = ({ name = '', type = '', link = '' }) => {
  console.log
  const icon = (type) => {
    switch (type) {
      case 'image/jpeg':
        return jpg
      case 'image/png':
        return jpg
      case 'application/pdf':
        return pdf
      case 'audio/mp3':
        return mp3
      case 'audio/mp4':
        return mp3
      case 'audio/mpeg':
        return mp3
      default:
        return
    }
  }

  return (
    <div>
      <img src={icon(type)} />
      <p>{name}</p>
    </div>
  )
}

export default File
