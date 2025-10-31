import FileLinkShare from '@/types/FileLinkShare'

export default interface FileLink {
  uuid: string,
  ownerId: number,
  path: string,
  isPublic: boolean,
  fileLinkShares: FileLinkShare[]
}