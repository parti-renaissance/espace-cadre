import { useState, useRef } from 'react'
import EmailEditor, { type EditorRef, type Editor, EmailEditorProps } from 'react-email-editor'
import { Box } from '@mui/material'
import * as Sentry from '@sentry/react'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { notifyMessages, notifyVariants } from '~/components/shared/notification/constants'
import UIFormMessage from '~/ui/FormMessage'
import { UNLAYER_PROJECT_ID } from '~/shared/environments'

import { MessageContent } from '~/domain/message'

const editorConfiguration = {
  tools: {
    button: { enabled: true },
    divider: { enabled: true },
    form: { enabled: true },
    heading: { enabled: true },
    image: { enabled: true },
    menu: { enabled: true },
    social: { enabled: true },
    text: { enabled: true },
    timer: { enabled: true },
    video: { enabled: true },
  },
  features: {
    preheaderText: false,
    textEditor: {
      tables: true,
      emojis: false,
    },
  },
}

const customOptions = {
  customCSS: [
    '.blockbuilder-preferences {display: none}',
    '.blockbuilder-layer-inline-editor-toolbar {display: none}',
    '.blockbuilder-page-layout {display: none}',
    '.preview-header {display: none}',
    '.actions-container {display: none}',
    '.ReactModal__Overlay--after-open {position: inherit !important}',
    '.ReactModal__Content--after-open {inset: 0 !important}',
  ],
}

const messages = {
  errorTemplate: 'Erreur au chargement du template',
  errorTemplateRecreate: 'Template non conforme, veuillez en créer un nouveau.',
}

type ExportHtmlResult = Parameters<Parameters<Editor['exportHtml']>[0]>[0]

export interface EditorProps {
  onMessageUpdate: (message: {
    design: ExportHtmlResult['design']
    chunks: Partial<ExportHtmlResult['chunks']>
  }) => void
  messageContent?: MessageContent
  templateId: number
  readOnly?: boolean
  allowExport?: boolean
}

const Editor = ({ onMessageUpdate, messageContent, templateId, readOnly = false }: EditorProps) => {
  const [messageContentError, setMessageContentError] = useState(false)
  const emailEditorRef = useRef<EditorRef | null>(null)
  const { enqueueSnackbar } = useCustomSnackbar()

  const additionalOptions = readOnly ? customOptions : {}

  const handleEditorReady: EmailEditorProps['onReady'] = editor => {
    editor.addEventListener('design:updated', () => {
      editor.exportHtml(data => {
        onMessageUpdate({ design: data.design, chunks: data.chunks })
      })
    })

    if (readOnly) {
      editor.showPreview('desktop')
    }
    if (!messageContent) {
      return
    }

    if (messageContent.json_content) {
      const design = JSON.parse(messageContent.json_content)
      editor.loadDesign(design)
    } else {
      setMessageContentError(true)
      enqueueSnackbar(notifyMessages.errorTitle, notifyVariants.error)
      Sentry.addBreadcrumb({
        category: 'messages',
        message: `${messages.errorTemplate}`,
        level: 'error',
      })
      Sentry.captureMessage(messages.errorTemplate)
    }
  }

  return (
    <Box component="div" sx={{ mb: 2 }} data-cy="unlayer-container">
      {messageContentError ? (
        <UIFormMessage severity="error">{messages.errorTemplateRecreate}</UIFormMessage>
      ) : (
        <>
          <EmailEditor
            minHeight="calc(100vh - 65px)"
            ref={emailEditorRef}
            onReady={handleEditorReady}
            options={{
              projectId: UNLAYER_PROJECT_ID ? Number(UNLAYER_PROJECT_ID) : null,
              locale: 'fr-FR',
              safeHtml: true,
              templateId: messageContent ? undefined : templateId,
              tools: readOnly ? {} : editorConfiguration.tools,
              features: readOnly ? {} : editorConfiguration.features,
              ...additionalOptions,
            }}
          />
        </>
      )}
    </Box>
  )
}

export default Editor
