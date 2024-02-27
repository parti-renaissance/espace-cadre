import { Card, CardContent, Stack, Button, CircularProgress, Grid, Typography, Link } from '@mui/material'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { paths } from '~/components/Messagerie/shared/paths'
import ManageLayout from '~/components/Messagerie/pages/manage/Layout'
import Message from '~/domain/message'
import { useScopedQueryKey } from '~/api/useQueryWithScope'
import { useQuery } from '@tanstack/react-query'
import { getMessage } from '~/api/messagerie'
import { useState } from 'react'
import Icon from '~/mui/iconify'
// import { getCurrentUser } from '~/redux/user/selectors'
// import { useSelector } from 'react-redux'
import useWaitForMessageSync from '~/components/Messagerie/hooks/useWaitForMessageSync'
import * as Sentry from '@sentry/react'

const openNewTab = (url: string) => {
  const win = window.open(url, '_blank')
  win?.focus()
}

const Recap = ({ data }: { data: Message }) => {
  // const { first_name, last_name, email_address } = useSelector(getCurrentUser)
  const recapData = [
    { label: 'Nom de la campagne', value: <Typography variant="subtitle2">{data.label}</Typography> },
    // {
    //   label: 'Expediteur',
    //   value: (
    //     <>
    //       <Typography variant="subtitle2">
    //         {first_name} {last_name}
    //       </Typography>{' '}
    //       {email_address}
    //     </>
    //   ),
    // },
    { label: 'Objet', value: data.subject },
  ]

  return (
    <ManageLayout
      title="Récapitulatif"
      subtitle={
        <Link
          color="primary"
          variant="body2"
          underline="hover"
          component={RouterLink}
          to={`/messagerie/${paths.update}/newsletter/${data.id}`}
        >
          Modifier ces informations
        </Link>
      }
    >
      <Stack spacing={4} direction="column" justifyContent="space-between">
        <Card>
          <CardContent>
            <Stack spacing={2} direction={'column'}>
              {recapData.map(({ label, value }) => (
                <Grid container key={label}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2">{label}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2">{value}</Typography>
                  </Grid>
                </Grid>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </ManageLayout>
  )
}

const Preview = ({ data }: { data: Message }) => {
  const navigate = useNavigate()
  const handleNext = () => navigate(`/messagerie/${paths.update}/newsletter/${data.id}/${paths.filter}`)
  const handleEdit = () => navigate(`/messagerie/${paths.update}/newsletter/${data.id}/${paths.unlayer}`)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.label,
          text: data.subject,
          url: data.previewLink,
        })
      } catch (error) {
        openNewTab(data.previewLink!)
      }
    }
    openNewTab(data.previewLink!)
  }
  const [isFrameLoading, setIsFrameLoading] = useState(true)
  const handleFrameLoad = () => setIsFrameLoading(false)
  return (
    <ManageLayout title="Aperçu" subtitle="Pensez à contrôler le bon affichage de votre email.">
      <Stack spacing={4} direction="column" justifyContent="space-between">
        <Card>
          <CardContent>
            {isFrameLoading && (
              <Stack justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress />
              </Stack>
            )}
            <iframe
              width={'100%'}
              style={{ border: 'none', height: '100vh' }}
              onLoad={handleFrameLoad}
              src={data.previewLink}
            ></iframe>
          </CardContent>
        </Card>
        <Stack spacing={2} direction="row" justifyContent="flex-end">
          <Button
            variant="outlined"
            size="large"
            onClick={handleShare}
            startIcon={<Icon icon="eva:diagonal-arrow-right-up-fill" />}
          >
            Partager le lien d&apos;aperçu
          </Button>
          <Button variant="outlined" size="large" onClick={handleEdit}>
            Revenir à l&apos;éditeur
          </Button>
          <Button variant="contained" size="large" onClick={handleNext}>
            Choisir les destinataires
          </Button>
        </Stack>
      </Stack>
    </ManageLayout>
  )
}

export default function NewsletterPreviewPage() {
  const { id } = useParams<{ id: string }>()
  const queryKey = useScopedQueryKey(['message', { feature: 'Messagerie', view: 'TemplateEditor', id }])
  const { isSync, isSyncing } = useWaitForMessageSync({
    uuid: id!,
    onError: e => {
      Sentry.captureException(e, { tags: { messageId: id } })
      Sentry.captureMessage('Error while waiting for message synchronization')
    },
    onTooManyRetries: () => {
      Sentry.captureMessage('Too many retries while waiting for message synchronization', {
        tags: { messageId: id },
      })
    },
  })
  const { data } = useQuery(queryKey, () => getMessage(id!), { enabled: isSync })

  if (!data || isSyncing) {
    return (
      <Stack justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <>
      <Recap data={data} />
      <Preview data={data} />
    </>
  )
}
