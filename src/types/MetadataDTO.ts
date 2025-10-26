export default interface MetadataDTO {
  name: string,
  size?: number,
  lastModified?: number,
  type: 'directory' | 'file',
  path: string,
  hasFiles: boolean,
}