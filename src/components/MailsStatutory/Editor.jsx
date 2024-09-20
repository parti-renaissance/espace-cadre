import { useState, useRef, useEffect } from 'react'
import EmailEditor from 'react-email-editor'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import * as Sentry from '@sentry/react'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { notifyMessages, notifyVariants } from '~/components/shared/notification/constants'
import UIFormMessage from '~/ui/FormMessage'
import { UNLAYER_PROJECT_ID } from '~/shared/environments'

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
}

const Editor = ({ messageContent, readOnly = false }) => {
  const emailEditorRef = useRef(null)
  const [editorReady, setEditorReady] = useState(false)
  const [messageContentError, setMessageContentError] = useState(false)
  const { enqueueSnackbar } = useCustomSnackbar()

  const additionalOptions = readOnly
    ? {
        customCSS: [
          '.blockbuilder-preferences {display: none}',
          '.blockbuilder-layer-inline-editor-toolbar {display: none}',
          '.blockbuilder-page-layout {display: none}',
          '.preview-header {display: none}',
          '.actions-container {display: none}',
          '.toolbar-right button {display: none !important}',
        ],
      }
    : {}

  useEffect(() => {
    if (!editorReady) {
      return
    }

    const editor = emailEditorRef.current.editor

    if (readOnly) {
      editor.showPreview('desktop')
    }

    if (messageContent) {
      if (messageContent.json_content) {
        const design = JSON.parse(messageContent.json_content)
        editor.loadDesign(design)
      } else {
        setMessageContentError(true)
        enqueueSnackbar(notifyMessages.errorTitle, notifyVariants.error, messages.errorTemplate)
        Sentry.addBreadcrumb({
          category: 'messages',
          message: `${messages.errorTemplate}`,
          level: 'error',
        })
        Sentry.captureMessage(messages.errorTemplate)
      }
    }
  }, [emailEditorRef, messageContent, editorReady, readOnly, enqueueSnackbar])

  return (
    <Box component="div" sx={{ mb: 2 }} data-cy="unlayer-container">
      {messageContentError ? (
        <UIFormMessage severity="error">{messages.errorTemplateRecreate}</UIFormMessage>
      ) : (
        <>
          <EmailEditor
            minHeight="85vh"
            ref={emailEditorRef}
            onReady={() => setEditorReady(true)}
            options={{
              projectId: UNLAYER_PROJECT_ID,
              locale: 'fr-FR',
              safeHtml: true,
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

Editor.propTypes = {
  messageContent: PropTypes.object,
  readOnly: PropTypes.bool,
}

export default Editor
