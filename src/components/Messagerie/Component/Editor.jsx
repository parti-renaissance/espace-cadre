import { useState, useRef, useEffect, useCallback } from 'react'
import EmailEditor from 'react-email-editor'
import { Button as MuiButton, Box } from '@mui/material'
import { styled } from '@mui/system'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useUserScope } from '../../../redux/user/hooks'
import { getMessageContent } from 'api/messagerie'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyMessages, notifyVariants } from 'components/shared/notification/constants'
import UIFormMessage from 'ui/FormMessage'
import * as Sentry from '@sentry/react'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { UNLAYER_PROJECT_ID } from 'shared/environments'
import scopes from 'shared/scopes'

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

const Editor = ({ onMessageSubject, onMessageUpdate }) => {
  const [editorLoaded, setEditorLoaded] = useState(false)
  const [messageContentError, setMessageContentError] = useState(false)
  const emailEditorRef = useRef(null)
  const { messageUuid } = useParams()
  const [currentScope] = useUserScope()
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()

  const [templateId] = useState(() => (currentScope ? templates[currentScope.getMainCode()] : defaultTemplate))

  const updateMessageTemplateCallback = useCallback(() => {
    emailEditorRef.current.exportHtml(data => {
      onMessageUpdate({
        design: data.design,
        chunks: data.chunks,
      })
    })
  }, [onMessageUpdate])

  const { data: messageContent = null } = useQueryWithScope(
    ['message-content', { feature: 'Messagerie', view: 'Editor' }, messageUuid],
    () => getMessageContent(messageUuid),
    { onError: handleError, enabled: !!messageUuid && editorLoaded }
  )

  useEffect(() => {
    const editor = emailEditorRef.current?.editor
    if (messageContent) {
      onMessageSubject(messageContent.subject)
      if (messageContent.json_content) {
        const design = JSON.parse(messageContent.json_content)
        editor.loadDesign(design)
        onMessageUpdate({
          design: design,
          chunks: { body: messageContent.content },
        })
      } else {
        setMessageContentError(true)
        enqueueSnackbar(notifyMessages.errorTitle, notifyVariants.error, messages.errorTemplate)
        Sentry.addBreadcrumb({
          category: 'messages',
          message: `${messages.errorTemplate} id=${messageUuid}`,
          level: 'error',
        })
        Sentry.captureMessage(messages.errorTemplate)
      }
    }
  }, [enqueueSnackbar, messageContent, messageUuid, onMessageSubject, onMessageUpdate])

  useEffect(() => {
    const editor = emailEditorRef.current?.editor
    const onEditorLoaded = () => {
      editor.addEventListener('design:updated', updateMessageTemplateCallback)
    }

    if (editorLoaded && editor) {
      onEditorLoaded()
    }

    return () => {
      editor?.removeEventListener('design:updated', updateMessageTemplateCallback)
    }
  }, [editorLoaded, updateMessageTemplateCallback])

  const exportHtml = () => {
    emailEditorRef.current.editor.exportHtml(data => {
      downloadHtml(data.html)
    })
  }

  return (
    <Box component="div" sx={{ mb: 2 }} data-cy="ckeditor-container">
      {messageContentError ? (
        <UIFormMessage severity="error">{messages.errorTemplateRecreate}</UIFormMessage>
      ) : (
        <>
          <EmailEditor
            minHeight="85vh"
            ref={emailEditorRef}
            projectId={UNLAYER_PROJECT_ID}
            onLoad={() => setEditorLoaded(true)}
            options={{
              locale: 'fr-FR',
              safeHtml: true,
              templateId: messageUuid ? null : templateId,
              tools: editorConfiguration.tools,
              features: editorConfiguration.features,
            }}
          />
          <Button variant="contained" size="medium" onClick={exportHtml}>
            {messages.export}
          </Button>
        </>
      )}
    </Box>
  )
}

Editor.propTypes = {
  onMessageSubject: PropTypes.func.isRequired,
  onMessageUpdate: PropTypes.func.isRequired,
}

export default Editor
