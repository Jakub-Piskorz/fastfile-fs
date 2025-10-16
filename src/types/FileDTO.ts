import MetadataDTO from '@/types/MetadataDTO'
import FileLink from '@/types/FileLink'

type FileDTO = {
  metadata: MetadataDTO,
  fileLink?: FileLink,
}

export default FileDTO