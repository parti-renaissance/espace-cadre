import { useState, useRef, useEffect } from 'react'
import EmailEditor, { type EditorRef, type Editor, EmailEditorProps } from 'react-email-editor'
import { Button as MuiButton, Box } from '@mui/material'
import { styled } from '@mui/system'
import * as Sentry from '@sentry/react'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { notifyMessages, notifyVariants } from '~/components/shared/notification/constants'
import UIFormMessage from '~/ui/FormMessage'
import { UNLAYER_PROJECT_ID } from '~/shared/environments'
import scopes from '~/shared/scopes'
import { useUserScope } from '../../../redux/user/hooks'

import { MessageContent } from '~/domain/message'

const downloadHtml = html => {
  const file = new Blob([html], { type: 'text/html' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(file)
  a.download = 'template.html'
  a.click()
}

const Button = styled(MuiButton)(
  ({ theme }) => `
  color: ${theme.palette.colors.gray['500']};
  background: ${theme.palette.colors.gray['200']};
  margin: ${theme.spacing(2, 0, 0)};
  &:hover, &:focus {
    color: ${theme.palette.colors.gray['500']};
    background: ${theme.palette.colors.gray['300']}
  }
`
)

const templates = {
  [scopes.referent]: 228742,
  [scopes.deputy]: 228747,
  [scopes.senator]: 60355,
  [scopes.animator]: 329570,
  [scopes.correspondent]: 123148,
  [scopes.legislative_candidate]: 165090,
  [scopes.regional_coordinator]: 276759,
  [scopes.regional_delegate]: 401163,
  [scopes.president_departmental_assembly]: 293625,
}
const defaultTemplate = 41208

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

const messages = {
  errorTemplate: 'Erreur au chargement du template',
  errorTemplateRecreate: 'Template non conforme, veuillez en créer un nouveau.',
  export: 'Export HTML',
}

type ExportHtmlResult = Parameters<Parameters<Editor['exportHtml']>[0]>[0]

export interface EditorProps {
  onMessageUpdate: (message: {
    design: ExportHtmlResult['design']
    chunks: Partial<ExportHtmlResult['chunks']>
  }) => void
  messageContent?: MessageContent
  readOnly?: boolean
  allowExport?: boolean
}

const Editor = ({ onMessageUpdate, messageContent, readOnly = false, allowExport = false }: EditorProps) => {
  const [messageContentError, setMessageContentError] = useState(false)
  const emailEditorRef = useRef<EditorRef | null>(null)
  const [currentScope] = useUserScope()
  const { enqueueSnackbar } = useCustomSnackbar()

  const [templateId] = useState(() => (currentScope ? templates[currentScope.getMainCode()] : defaultTemplate))

  const additionalOptions = readOnly
    ? {
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
    : {}

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

  useEffect(
    () => () => {
      const editor = emailEditorRef?.current?.editor
      editor?.removeEventListener('design:updated')
    },
    [emailEditorRef]
  )

  const exportHtml = () => {
    emailEditorRef?.current?.editor?.exportHtml(data => {
      downloadHtml(data.html)
    })
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
              locale: 'fr-FR',
              safeHtml: true,
              projectId: UNLAYER_PROJECT_ID ? Number(UNLAYER_PROJECT_ID) : undefined,
              templateId: messageContent ? undefined : templateId,
              tools: readOnly ? {} : editorConfiguration.tools,
              features: readOnly ? {} : editorConfiguration.features,
              ...additionalOptions,
            }}
          />
          {allowExport && (
            <Button variant="contained" size="medium" onClick={exportHtml}>
              {messages.export}
            </Button>
          )}
        </>
      )}
    </Box>
  )
}

export default Editor
