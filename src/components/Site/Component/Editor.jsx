import { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import EmailEditor from 'react-email-editor'
import { Button as MuiButton, Box } from '@mui/material'
import * as Sentry from '@sentry/react'
import { styled } from '@mui/system'
import { UNLAYER_PROJECT_ID } from 'shared/environments'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyMessages, notifyVariants } from 'components/shared/notification/constants'
import UIFormMessage from 'ui/FormMessage/FormMessage'
import { getSiteContent } from 'api/site'
import { useQueryWithScope } from 'api/useQueryWithScope'

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
      background: ${theme.palette.colors.gray['100']}
  }
`
)

const defaultTemplate = 278003
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
  save: 'Enregistrer',
  update: 'Mettre à jour',
}

const Editor = ({ onContentUpdate }) => {
  const [editorLoaded, setEditorLoaded] = useState(false)
  const [messageContentError, setMessageContentError] = useState(false)
  const editorRef = useRef(null)
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()

  const updateContentTemplateCallback = useCallback(() => {
    editorRef.current.exportHtml(data => {
      onContentUpdate({
        design: data.design,
        chunks: data.chunks,
      })
    })
  }, [onContentUpdate])

  const { data: siteContent = null } = useQueryWithScope(
    ['message-content', { feature: 'Site', view: 'Editor' }],
    () => getSiteContent('51e507e5-3d7c-4f08-b05d-b7cb45e960d3'),
    { onError: handleError, enabled: editorLoaded }
  )

  useEffect(() => {
    const editor = editorRef.current?.editor
    if (siteContent) {
      if (siteContent.json_content) {
        const design = JSON.parse(siteContent.json_content)
        editor.loadDesign(design)
        onContentUpdate({
          design: design,
          chunks: { body: siteContent.content },
        })
      } else {
        setMessageContentError(true)
        enqueueSnackbar(notifyMessages.errorTitle, notifyVariants.error, messages.errorTemplate)
        Sentry.addBreadcrumb({
          category: 'messages',
          message: `${messages.errorTemplate}`,
          level: Sentry.Severity.Critical,
        })
        Sentry.captureMessage(messages.errorTemplate)
      }
    }
  }, [enqueueSnackbar, siteContent, onContentUpdate])

  useEffect(() => {
    const editor = editorRef.current?.editor
    const onEditorLoaded = () => {
      editor.addEventListener('design:updated', updateContentTemplateCallback)
    }

    if (editorLoaded && editor) {
      onEditorLoaded()
    }

    return () => {
      editor?.removeEventListener('design:updated', updateContentTemplateCallback)
    }
  }, [editorLoaded, updateContentTemplateCallback])

  const exportHtml = () => {
    editorRef.current.editor.exportHtml(data => {
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
            ref={editorRef}
            projectId={UNLAYER_PROJECT_ID}
            onLoad={() => setEditorLoaded(true)}
            options={{
              locale: 'fr-FR',
              safeHtml: true,
              templateId: defaultTemplate,
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
  onContentUpdate: PropTypes.func.isRequired,
}

export default Editor
