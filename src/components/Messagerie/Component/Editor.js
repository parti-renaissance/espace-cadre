import { useState, useRef, useEffect, useCallback } from 'react'
import EmailEditor from 'react-email-editor'
import { Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useUserScope } from '../../../redux/user/hooks'
import { getMessageContent } from 'api/messagerie'
import { useQuery } from 'react-query'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyMessages, notifyVariants } from 'components/shared/notification/constants'
import UIFormMessage from 'ui/FormMessage'
import * as Sentry from '@sentry/react'

const downloadHtml = html => {
  const file = new Blob([html], { type: 'text/html' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(file)
  a.download = 'template.html'
  a.click()
}

const messages = {
  errorTemplate: 'Erreur au chargement du template',
  errorTemplateRecreate: 'Template non conforme, veuillez en créer un nouveau.',
}
const useStyles = makeStyles(theme => ({
  emailEditor: {
    marginBottom: theme.spacing(2),
  },
  exportButton: {
    color: theme.palette.gray500,
    background: theme.palette.gray200,
    margin: theme.spacing(2, 0, 0),
    '&:hover, &:focus': {
      color: theme.palette.gray500,
      background: theme.palette.gray100,
    },
  },
}))
const referentTemplate = 60354
const deputyTemplate = 60376
const senatorTemplate = 60355
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
const Editor = ({ onMessageSubject, onMessageUpdate }) => {
  const [editorLoaded, setEditorLoaded] = useState(false)
  const [messageContentError, setMessageContentError] = useState(false)
  const emailEditorRef = useRef(null)
  const classes = useStyles()
  const { messageUuid } = useParams()
  const [currentScope] = useUserScope()
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()

  const [templateId] = useState(() => {
    if (currentScope?.code === 'referent') {
      return referentTemplate
    }
    if (currentScope?.code === 'deputy') {
      return deputyTemplate
    }
    if (currentScope?.code === 'senator') {
      return senatorTemplate
    }
    return defaultTemplate
  })

  const updateMessageTemplateCallback = useCallback(() => {
    emailEditorRef.current.exportHtml(data => {
      onMessageUpdate({
        design: data.design,
        chunks: data.chunks,
      })
    })
  }, [onMessageUpdate])

  const { data: messageContent = null } = useQuery(
    ['messageContent', messageUuid],
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
    <div className={classes.emailEditor}>
      {messageContentError ? (
        <UIFormMessage severity="error">{messages.errorTemplateRecreate}</UIFormMessage>
      ) : (
        <>
          <EmailEditor
            minHeight="85vh"
            ref={emailEditorRef}
            projectId={process.env.REACT_APP_UNLAYER_PROJECT_ID}
            onLoad={() => setEditorLoaded(true)}
            options={{
              locale: 'fr-FR',
              safeHtml: true,
              templateId: messageUuid ? null : templateId,
              tools: editorConfiguration.tools,
              features: editorConfiguration.features,
            }}
          />
          <Button variant="contained" size="medium" className={classes.exportButton} onClick={exportHtml}>
            Export HTML
          </Button>
        </>
      )}
    </div>
  )
}

Editor.propTypes = {
  onMessageSubject: PropTypes.func.isRequired,
  onMessageUpdate: PropTypes.func.isRequired,
}

export default Editor
