import { create } from 'zustand'
import { AxiosResponse } from 'axios'
import Api, { FileDTO } from '@/api'
import { useQuery } from '@tanstack/react-query'
import useUuid from '@/hooks/useUuid'
import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { Routes, useCurrentRoute } from '@/router/router'
import { useStore } from '@/store/store'

export enum FileScreen {
  'files', 'search', 'filesIShare', 'filesSharedWithMe', 'link'
}

export type FileQuery = {
  screen: FileScreen,
  search?: string
}

export interface FileStoreI {
  fileQuery: FileQuery
  setFileQuery: (query: FileQuery) => void
}

export const useFileStore = create<FileStoreI>((set) => ({
  fileQuery: { screen: FileScreen.files },
  setFileQuery: (fileQuery) => set(() => ({ fileQuery }))
}))


type AnyFilesApi = () => Promise<AxiosResponse<FileDTO | FileDTO[]>>

export const useTitle = () => {
  const currentRoute = useCurrentRoute()
  const username = useStore(s => s.username)
  const location = useLocation()

  let currentDirectory = decodeURIComponent(location.pathname)
  if (currentDirectory === '/') currentDirectory = ''
  if (currentRoute === Routes.app) return username + currentDirectory
  if (currentRoute === Routes.shared) return 'Shared files'
  if (currentRoute === Routes.download) return 'File for download'
  if (currentRoute === Routes.sharedWithMe) return 'Shared with me'
  return username + currentDirectory || ''
}

export const useFilesQuery = () => {
  const uuid = useUuid()
  const location = useLocation()
  const path = location.pathname.slice(1)
  const fileQuery = useFileStore(s => s.fileQuery)

  const screenToApiMapper = useMemo(() => new Map<FileScreen, AnyFilesApi>([
    [FileScreen.files, () => Api.api.filesInDirectory(path)],
    [FileScreen.search, () => Api.api.searchFiles({
      fileName: fileQuery.search,
      directory: location.pathname
    })],
    [FileScreen.filesIShare, Api.api.getMyLinks],
    [FileScreen.filesSharedWithMe, Api.api.linksSharedToMe],
    [FileScreen.link, () => Api.api.lookupLinkFile(uuid!)]
  ]), [fileQuery.search, location.pathname, path, uuid])

  return useQuery({
    queryKey: ['files', fileQuery.screen, path, uuid || fileQuery.search],
    queryFn: screenToApiMapper.get(fileQuery.screen)
  })
}