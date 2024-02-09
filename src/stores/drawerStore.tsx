import { create } from 'zustand'

type DrawerStore = {
  fullscreen: boolean
  hideNav: boolean
  setFullscreen: (fullscreen: boolean) => void
  setHideNav: (hideNav: boolean) => void
}

const useDrawerStore = create<DrawerStore>()(set => ({
  fullscreen: false,
  hideNav: false,
  setFullscreen: (fullscreen: boolean) => set({ fullscreen }),
  setHideNav: (hideNav: boolean) => set({ hideNav }),
}))

export default useDrawerStore
