import { useEffect, useState } from 'react'
import { Container, Grid, Link as MuiLink } from '@mui/material'
import { styled } from '@mui/system'
import * as Sentry from '@sentry/react'
import { useUserScope } from '../../redux/user/hooks'
import paths from 'shared/paths'
import PageHeader from 'ui/PageHeader'
import { createSiteContent, getSites, updateSiteContent } from 'api/site'
import Editor from './Component/Editor'
import { useQueryWithScope } from 'api/useQueryWithScope'
import Loader from 'ui/Loader'
import StepButton from 'components/Messagerie/Component/StepButton'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { RE_HOST } from 'shared/environments'

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
  title: 'Site Départemental',
  titleSuffix: 'Gestion du site',
  createSuccess: 'Site créé avec succès',
  updateSuccess: 'Site modifié avec succès',
  error: 'Erreur lors de la création/édition du site',
  save: 'Enregistrer',
  update: 'Mettre à jour',
  preview: 'Prévisualiser',
}

const DepartmentSite = () => {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sites, setSites] = useState([])
  const [siteUuid, setSiteUuid] = useState(null)
  const { enqueueSnackbar } = useCustomSnackbar()
  const [currentScope] = useUserScope()
  const { data, isLoading } = useQueryWithScope(
    ['departments-sites', { feature: 'Sites', view: 'DepartmentSite' }],
    getSites,
    {}
  )

  useEffect(() => {
    const items = data?.items || []
    setSites(items)

    if (items.length > 0) {
      setSiteUuid(items[0].uuid)
    }
  }, [data, siteUuid])

  const editContent = () => {
    const body = {
      zone: currentScope?.zones[0]?.uuid,
      content: content.chunks.body,
      json_content: JSON.stringify(content.design),
    }

    return siteUuid ? updateSiteContent(siteUuid, body) : createSiteContent(body)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const body = await editContent()
      setContent(body)
      enqueueSnackbar(siteUuid ? messages.updateSuccess : messages.createSuccess)

      if (!siteUuid) {
        const sites = await getSites()
        setSiteUuid(sites[0].uuid)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      enqueueSnackbar(messages.error, notifyVariants.error)
      Sentry.captureException(error)
    }
  }

  if (isLoading)
    return (
      <Container maxWidth="lg">
        <Loader />
      </Container>
    )

  return (
    <Container maxWidth="lg">
      <PageHeader title={messages.title} titleLink={paths.department_site} titleSuffix={messages.titleSuffix} />
      <SectionHeader container>
        <Grid item xs={8} />
        <Grid item xs>
          <StepButton
            label={sites.length === 0 ? messages.save : messages.update}
            loading={loading}
            disabled={loading}
            onClick={handleSubmit}
            showIcon={false}
          />
        </Grid>
        {siteUuid && (
          <Grid item xs>
            <Link href={`${RE_HOST}/federations/${sites[0].slug}`} target="_blank" rel="noreferrer" underline="none">
              {messages.preview}
            </Link>
          </Grid>
        )}
      </SectionHeader>
      <Editor siteUuid={siteUuid} onContentUpdate={setContent} />
    </Container>
  )
}

export default DepartmentSite
