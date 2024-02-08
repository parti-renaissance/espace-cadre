import { useState, useRef, useEffect, useCallback } from 'react'
import EmailEditor from 'react-email-editor'
import { Box } from '@mui/material'
import PropTypes from 'prop-types'
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

const Editor = ({ onMessageSubject, onMessageUpdate, messageContent, templateId, readOnly = false }) => {
  const [editorLoaded, setEditorLoaded] = useState(false)
  const [messageContentError, setMessageContentError] = useState(false)
  const emailEditorRef = useRef(null)

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

  const updateMessageTemplateCallback = useCallback(() => {
    emailEditorRef.current.editor.exportHtml(data => {
      onMessageUpdate({
        design: data.design,
        chunks: data.chunks,
      })
    })
  }, [onMessageUpdate])

  useEffect(() => {
    if (!editorLoaded) {
      return
    }

    const editor = emailEditorRef.current?.editor

    if (messageContent) {
      onMessageSubject(messageContent?.subject)
      if (messageContent.json_content) {
        const design = JSON.parse(messageContent.json_content)
        editor.loadDesign(design)
        onMessageUpdate({
          design: design,
          chunks: { body: messageContent.content },
        })
      }
    }

    editor.addEventListener('design:updated', updateMessageTemplateCallback)

    return () => editor?.removeEventListener('design:updated', updateMessageTemplateCallback)
  }, [editorLoaded, emailEditorRef, messageContent, onMessageSubject, onMessageUpdate, updateMessageTemplateCallback])

  return (
    <Box component="div" sx={{ mb: 2 }} data-cy="unlayer-container">
      {messageContentError ? (
        <UIFormMessage severity="error">{messages.errorTemplateRecreate}</UIFormMessage>
      ) : (
        <>
          <EmailEditor
            minHeight="85vh"
            ref={emailEditorRef}
            onReady={() => setEditorLoaded(true)}
            options={{
              projectId: UNLAYER_PROJECT_ID,
              locale: 'fr-FR',
              safeHtml: true,
              templateId: messageContent ? null : templateId,
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
  onMessageSubject: PropTypes.func.isRequired,
  onMessageUpdate: PropTypes.func.isRequired,
  templateId: PropTypes.number,
  messageContent: PropTypes.object,
  readOnly: PropTypes.bool,
}

export default Editor
