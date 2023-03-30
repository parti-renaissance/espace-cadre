import { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import EmailEditor from 'react-email-editor'
import { Button as MuiButton, Box, Container } from '@mui/material'
import { styled } from '@mui/system'
import { UNLAYER_PROJECT_ID } from 'shared/environments'
import { useErrorHandler } from 'components/shared/error/hooks'
import { getDepartmentalSite } from 'api/departmental-site'
import { useQueryWithScope } from 'api/useQueryWithScope'
import Loader from 'ui/Loader'

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
}

const Editor = ({ siteUuid, onContentUpdate, refreshContent }) => {
  const editorRef = useRef(null)
  const [editorLoaded, setEditorLoaded] = useState(false)
  const [site, setSite] = useState()
  const { handleError } = useErrorHandler()

  const updateContentCallback = useCallback(
    () =>
      editorRef.current.editor.exportHtml(({ design, html }) => onContentUpdate({ design, html }), { minify: true }),
    [onContentUpdate]
  )

  const { isFetching } = useQueryWithScope(
    ['departments-site-content', siteUuid],
    () => getDepartmentalSite(siteUuid),
    {
      enabled: refreshContent && !!siteUuid,
      onSuccess: response => setSite(response),
      onError: handleError,
    }
  )

  useEffect(() => {
    const editor = editorRef.current?.editor
    const onEditorLoaded = () => {
      editor.addEventListener('design:updated', updateContentCallback)
    }

    if (editorLoaded && editor) {
      onEditorLoaded()
    }

    return () => {
      editor?.removeEventListener('design:updated', updateContentCallback)
    }
  }, [editorRef, editorLoaded, updateContentCallback])

  useEffect(() => {
    if (!editorLoaded) {
      return
    }

    if (site?.json_content) {
      editorRef.current.editor.loadDesign(JSON.parse(site?.json_content))
    } else {
      editorRef.current.editor.loadTemplate(defaultTemplate)
    }
  }, [editorRef, editorLoaded, site])

  const exportHtml = () => {
    editorRef.current.editor.exportHtml(data => downloadHtml(data.html), { minify: true })
  }

  if (isFetching) {
    return (
      <Container maxWidth="xl">
        <Loader />
      </Container>
    )
  }

  return (
    <Box component="div" sx={{ mb: 2 }} data-cy="ckeditor-container">
      <EmailEditor
        minHeight="85vh"
        ref={editorRef}
        projectId={UNLAYER_PROJECT_ID}
        onLoad={() => setEditorLoaded(true)}
        options={{
          displayMode: 'web',
          locale: 'fr-FR',
          safeHtml: true,
          tools: editorConfiguration.tools,
          features: editorConfiguration.features,
        }}
      />
      <Button variant="contained" size="medium" onClick={exportHtml}>
        {messages.export}
      </Button>
    </Box>
  )
}

Editor.defaultProps = {
  siteUuid: null,
}

Editor.propTypes = {
  onContentUpdate: PropTypes.func.isRequired,
  siteUuid: PropTypes.string,
  refreshContent: PropTypes.bool,
}

export default Editor
