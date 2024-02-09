import { create } from 'zustand'

import { MessageContent } from '~/domain/message'

type NewsletterEditorStore = {
  data: Partial<MessageContent> | null
  setData: (data: Partial<MessageContent>) => void
}

export const useNewsletterEditorStore = create<NewsletterEditorStore>(set => ({
  data: null,
  setData: data => set({ data }),
}))
