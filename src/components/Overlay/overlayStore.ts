import OverlayState from './OverlayStateEnum'
import { create } from 'zustand'

export interface OverlayStoreI {
  overlay: OverlayState
  setOverlay: (overlay: this['overlay']) => void
  resolveOverlay?: (result: boolean) => any
  askOverlay: (state: OverlayState, data?: any) => Promise<boolean>
  overlayData?: any
}

export const useOverlayStore = create<OverlayStoreI>((set, get) => ({
  overlay: OverlayState.hidden,
  setOverlay: (overlay) => set({ overlay }),

  overlayData: undefined,
  resolveOverlay: undefined,

  // Use this when you need to show an overlay as part of an async flow.
  // Example: `const confirmed = await askOverlay(OverlayState.deleteWarning, file)`.
  // The promise resolves once you call `resolve(true | false)` from the overlay UI.
  askOverlay: async (state, data) => {
    try {
      return await new Promise<boolean>((resolveOverlay) => {
        set({ overlay: state, overlayData: data, resolveOverlay })
      })
    } finally {
      const { overlay } = get()
      if (overlay === state) {
        set({ overlay: OverlayState.hidden, overlayData: undefined, resolveOverlay: undefined })
      }
    }
  }
}))