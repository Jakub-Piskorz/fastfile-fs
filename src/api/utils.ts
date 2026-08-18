import Api from '@/api'

export const download = async (filePaths: string[] = [], uuid?: string) => {
  if (filePaths.length === 0 && !uuid) return

  const response = uuid ?
    await Api.api.downloadFileFromLink(uuid, { format: 'blob' }) :
    filePaths.length === 1 ?
      await Api.api.downloadFile(filePaths[0], { format: 'blob' }) :
      await Api.api.downloadMultiple({ filePaths }, { format: 'blob' })

  if (response.status !== 200) {
    throw new Error(
      `Error code: ${response?.status}. File cannot be downloaded.`
    )
  }

  // Extract file name from response header.
  const fileName = response.headers['content-disposition']!
    .match(/filename="?([^"]+)"?/i)?.[1]

  const url = window.URL.createObjectURL(response.data as Blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
}

