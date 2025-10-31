import OverlayState from './OverlayStateEnum'
import { create } from 'zustand'

export interface OverlayStoreI {
  overlay: OverlayState
  setOverlay: (overlay: this['overlay']) => void

  // If we want to integrate overlay view in async flow, below
  // Simply call for example: `await askOverlay(OverlayState.deleteWarning, data: selectedFiles)` and it will be resolved once user clicks a button.
  // When modal closes, remember to put: 'resolve(boolean)' and 'setResolve(undefined)' so promise resolves, and resolver from that promise gets removed.
  resolve?: (result: boolean) => any
  setResolve: (resolve?: this['resolve']) => void
  askOverlay: (state: OverlayState, data?: any) => Promise<boolean>
  data?: any
}

export const useOverlayStore = create<OverlayStoreI>((set) => ({
  overlay: OverlayState.hidden,
  setOverlay: (overlay) => set({ overlay }),
  data: undefined,
  resolve: undefined,
  setResolve: (resolve) => set({ resolve }),

  askOverlay: (state, data) =>
    new Promise<boolean>((resolve) => {
      set({ overlay: state, data, resolve })
    })
}))