import { useEffect, useState } from 'react'
import { Container, Grid } from '@mui/material'
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

const SectionHeader = styled(Grid)(
  ({ theme }) => `
  background: ${theme.palette.colors.white};
  padding: ${theme.spacing(2)};
  border-radius: 12px 12px 0 0;
`
)

const messages = {
  title: 'Site Departemental',
  titleSuffix: 'Gestion du site',
  createSuccess: 'Site créé avec succès',
  updateSuccess: 'Site modifié avec succès',
  save: 'Enregistrer',
  update: 'Mettre à jour',
}

const DepartmentSite = () => {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sites, setSites] = useState([])
  const [siteUuid, setSiteUuid] = useState(null)
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
      // if (siteUuid) {
      //   const currentSite = async () => {
      //     const site =  await getSiteContent(siteUuid)
      //     console.log(site);
      //     setContent(site)
      //   }

      //   currentSite()
      // }
    }
  }, [data, siteUuid])

  const editContent = () => {
    const body = {
      zone: currentScope?.zones[0]?.uuid,
      content: content.chunks.body,
      json_content: JSON.stringify(content.design),
    }

    return sites.length === 0 ? createSiteContent(body) : updateSiteContent(siteUuid, body)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const body = await editContent()
      setContent(body)
      setLoading(false)
    } catch (error) {
      setLoading(false)
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
        <Grid item xs={10} />
        <Grid item xs>
          <StepButton
            label={sites.length === 0 ? messages.save : messages.update}
            loading={loading}
            disabled={loading}
            onClick={handleSubmit}
            showIcon={false}
          />
        </Grid>
      </SectionHeader>
      <Editor siteUuid={siteUuid} onContentUpdate={setContent} />
    </Container>
  )
}

export default DepartmentSite
