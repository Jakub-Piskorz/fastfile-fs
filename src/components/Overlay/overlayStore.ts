import OverlayState from './OverlayStateEnum'
import { create } from 'zustand'

export interface OverlayStoreI {
  overlay: OverlayState
  setOverlay: (overlay: this['overlay']) => void
  resolve?: (result: boolean) => any
  setResolve: (resolve?: this['resolve']) => void
  askOverlay: (state: OverlayState, data?: any) => Promise<boolean>
  data?: any
}

export const useOverlayStore = create<OverlayStoreI>((set, get) => ({
  overlay: OverlayState.hidden,
  setOverlay: (overlay) => set({ overlay }),

  data: undefined,
  resolve: undefined,
  setResolve: (resolve) => set({ resolve }),

  // Use this when you need to show an overlay as part of an async flow.
  // Example: `const confirmed = await askOverlay(OverlayState.deleteWarning, file)`.
  // The promise resolves once you call `resolve(true | false)` from the overlay UI.
  askOverlay: async (state, data) => {
    try {
      return await new Promise<boolean>((resolve) => {
        set({ overlay: state, data, resolve })
      })
    } finally {
      const { overlay } = get()
      if (overlay === state) {
        set({ overlay: OverlayState.hidden, data: undefined, resolve: undefined })
      }
    }
  }
}))