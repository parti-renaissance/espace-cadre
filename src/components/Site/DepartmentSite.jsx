import { useState } from 'react'
import { Container, Grid, Link as MuiLink } from '@mui/material'
import { styled } from '@mui/system'
import * as Sentry from '@sentry/react'
import { useUserScope } from '../../redux/user/hooks'
import paths from '~/shared/paths'
import PageHeader from '~/ui/PageHeader'
import { createDepartmentalSite, getDepartmentalSites, updateDepartmentalSite } from '~/api/departmental-site'
import Editor from './Component/Editor'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import Loader from '~/ui/Loader'
import StepButton from '~/components/Messagerie/Component/StepButton'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'

const SectionHeader = styled(Grid)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  background: ${theme.palette.colors.white};
  padding: ${theme.spacing(2)};
  border-radius: 12px 12px 0 0;
`
)

const Link = styled(MuiLink)(
  ({ theme, disabled }) => `
  display: inline-block;
  margin-left: 8px;
  width: auto;
  border-radius: 8px;
  padding: ${theme.spacing(1, 2)};
  color: ${disabled ? theme.palette.colors.disabled : theme.palette.colors.gray['800']};
  background: ${disabled ? theme.palette.colors.gray['300'] : theme.palette.colors.gray['100']};
  &:hover {
    background: ${theme.palette.colors.gray['200']};
  }
`
)

const messages = {
  title: 'Site départemental',
  titleSuffix: 'Gestion du site',
  createSuccess: 'Site créé avec succès',
  updateSuccess: 'Site modifié avec succès',
  error: 'Erreur lors de la création/édition du site',
  save: 'Enregistrer',
  update: 'Mettre à jour',
  preview: 'Prévisualiser',
}

const clearHtml = html => {
  const bodyIndex = html.indexOf('<body')

  return (
    html.substring(html.indexOf('<style'), html.indexOf('</style>') + 8) +
    html.substring(bodyIndex + html.indexOf('>', bodyIndex) - bodyIndex + 1, html.indexOf('</body>'))
  )
}

const editContent = (siteUuid, { currentScope, content }) => {
  const body = {
    zone: currentScope?.zones[0]?.uuid,
    content: clearHtml(content.html),
    json_content: JSON.stringify(content.design),
  }

  return siteUuid ? updateDepartmentalSite(siteUuid, body) : createDepartmentalSite(body)
}

const DepartmentSite = () => {
  const [currentSite, setCurrentSite] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const [needRefreshContent, setNeedRefreshContent] = useState(false)
  const [contentState, setContentState] = useState({
    content: null,
    persisted: true,
  })
  const { enqueueSnackbar } = useCustomSnackbar()
  const [currentScope] = useUserScope()

  useQueryWithScope(['departments-sites', { feature: 'Sites', view: 'DepartmentSite' }], getDepartmentalSites, {
    onSuccess: response => {
      const items = response?.items || []

      if (items.length) {
        setCurrentSite(items[0])
        setNeedRefreshContent(true)
      }

      setIsLoading(false)
    },
  })

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Loader isCenter />
      </Container>
    )
  }

  const handleSubmit = async () => {
    setIsButtonLoading(true)

    try {
      const body = await editContent(currentSite?.uuid, { currentScope, content: contentState.content })
      enqueueSnackbar(currentSite ? messages.updateSuccess : messages.createSuccess)

      setContentState(prevState => ({ ...prevState, persisted: true }))

      if (!currentSite) {
        setCurrentSite(body)
      }
    } catch (error) {
      Sentry.captureException(error)
    }

    setIsButtonLoading(false)
  }

  return (
    <Container maxWidth={false}>
      <PageHeader title={messages.title} titleLink={paths.department_site} titleSuffix={messages.titleSuffix} />
      <SectionHeader container>
        <Grid item xs={8} />
        <Grid item xs>
          <StepButton
            label={currentSite ? messages.update : messages.save}
            loading={isButtonLoading}
            disabled={isButtonLoading || contentState.persisted}
            onClick={handleSubmit}
            showIcon={false}
          />
        </Grid>
        {currentSite && (
          <Grid item xs>
            <Link href={currentSite.url} target="_blank" rel="noreferrer" underline="none">
              {messages.preview}
            </Link>
          </Grid>
        )}
      </SectionHeader>

      <Editor
        siteUuid={currentSite?.uuid}
        onContentUpdate={data => setContentState(prevState => ({ ...prevState, content: data, persisted: false }))}
        refreshContent={needRefreshContent}
      />
    </Container>
  )
}

export default DepartmentSite
