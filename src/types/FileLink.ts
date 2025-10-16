import { FileLinkShare } from '@/hooks/store'

export default interface FileLink {
  uuid: string,
  ownerId: number,
  path: string,
  isPublic: boolean,
  fileLinkShares: FileLinkShare[]
}