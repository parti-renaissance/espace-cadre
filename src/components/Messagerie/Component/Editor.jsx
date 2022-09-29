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

const downloadHtml = html => {
  const file = new Blob([html], { type: 'text/html' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(file)
  a.download = 'template.html'
  a.click()
}

const Button = styled(MuiButton)(
  ({ theme }) => `
  color: ${theme.palette.gray500};
  background: ${theme.palette.gray200};
  margin: ${theme.spacing(2, 0, 0)};
  &:hover, &:focus {
      color: ${theme.palette.gray500};
      background: ${theme.palette.gray100}
  }
`
)

const referentTemplate = 228742
const deputyTemplate = 228747
const senatorTemplate = 60355
const correspondentTemplate = 123148
const legislativeCandidateTemplate = 165090
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

const templates = {
  referent: referentTemplate,
  deputy: deputyTemplate,
  senator: senatorTemplate,
  correspondent: correspondentTemplate,
  legislative_candidate: legislativeCandidateTemplate,
}

const Editor = ({ onMessageSubject, onMessageUpdate }) => {
  const [editorLoaded, setEditorLoaded] = useState(false)
  const [messageContentError, setMessageContentError] = useState(false)
  const emailEditorRef = useRef(null)
  const { messageUuid } = useParams()
  const [currentScope] = useUserScope()
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()

  const [templateId] = useState(() => {
    const { code, delegated_access } = currentScope || {}
    return templates[delegated_access?.type || code] || defaultTemplate
  })

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
          level: Sentry.Severity.Critical,
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
