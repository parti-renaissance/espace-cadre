import { useParams } from 'react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { cancelDesignation, getDesignation } from '~/api/designations'
import Loader from '~/ui/Loader'
import { Button, Container, Grid, Stack, Tab, Tabs, Typography } from '@mui/material'
import PageHeader from '~/ui/PageHeader'
import { FeatureEnum } from '~/models/feature.enum'
import paths from '~/shared/paths'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'
import Iconify from '~/mui/iconify'
import { useNavigate } from 'react-router-dom'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { notifyVariants } from '~/components/shared/notification/constants'
import ConfirmButton from '~/ui/Button/ConfirmButton'
import { useErrorHandler } from '~/components/shared/error/hooks'
import Badge from '~/ui/Badge/Badge'
import { messages } from '~/components/Consultations/messages'
import { DesignationTypeEnum } from '~/domain/designation'
import { useState } from 'react'
import { TabContext, TabPanel } from '@mui/lab'
import Main from '~/components/Consultations/Show/Tabs/Main'
import Participants from '~/components/shared/election/Participants'
import Calendar from '~/components/Consultations/Components/Calendar'
import Statistics from '~/components/Consultations/Show/Tabs/Statistics'
import { OAUTH_HOST } from '~/shared/environments'

const Show = () => {
  const { isMobile } = useCurrentDeviceType()
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError } = useErrorHandler()
  const [selectedTab, setSelectedTab] = useState<string>('election-tab-0')
  const navigate = useNavigate()
  const { uuid } = useParams()
  const {
    data: designation,
    isFetching,
    refetch,
  } = useQuery(['designation', uuid], () => getDesignation(uuid as string))

  const { mutate, isLoading } = useMutation((id: string) => cancelDesignation(id), {
    onSuccess: () => {
      enqueueSnackbar(
        messages[designation?.type as DesignationTypeEnum].notification.cancel_success,
        notifyVariants.success
      )
      refetch()
    },
    onError: handleError,
  })

  if (isFetching) {
    return <Loader isCenter />
  }

  if (!designation) {
    enqueueSnackbar(messages.notification.not_found, notifyVariants.error)
    navigate(paths[FeatureEnum.DESIGNATION])
    return null
  }

  return (
    <Container maxWidth={false}>
      <Grid container justifyContent="space-between" sx={{ mb: isMobile ? 2 : null }}>
        <PageHeader
          title={designation.customTitle}
          badge={
            designation.isCanceled && (
              <Badge
                badge={{ label: 'Annulée', badgeOptions: { color: 'colors.red.400', bgcolor: 'colors.red.100' } }}
              />
            )
          }
          startButton={
            <Button
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
              onClick={() => navigate(paths[FeatureEnum.DESIGNATION])}
            >
              Retour
            </Button>
          }
          button={
            !designation.isCanceled && (
              <Stack alignItems="center" direction="row" spacing={2}>
                <Button
                  startIcon={<Iconify icon={'eva:external-link-outline'} />}
                  variant="contained"
                  color="primary"
                  href={`${OAUTH_HOST}/election-sas/${designation.id}`}
                  target="_blank"
                >
                  Voir
                </Button>

                <Button
                  startIcon={<Iconify icon={'eva:edit-outline'} />}
                  variant="contained"
                  color="inherit"
                  disabled={isLoading}
                  onClick={() => navigate(paths[FeatureEnum.DESIGNATION] + '/' + designation.id + '/modifier')}
                >
                  Modifier
                </Button>

                <ConfirmButton
                  disabled={!designation.isFullyEditable || isLoading}
                  isDangerButton
                  title={messages[designation.type as DesignationTypeEnum].modal.cancel.title}
                  description={messages[designation.type as DesignationTypeEnum].modal.cancel.content}
                  onClick={() => mutate(designation.id as string)}
                >
                  <Iconify icon={'eva:close-circle-outline'} />
                  <Typography fontWeight="bold" fontSize={14}>
                    Annuler
                  </Typography>
                </ConfirmButton>
              </Stack>
            )
          }
        />
      </Grid>

      <Grid container spacing={2} sx={{ mt: 0, ...(isMobile && { pt: 2 }) }}>
        <Grid item xs={12}>
          <TabContext value={selectedTab}>
            <Stack>
              <Tabs value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)}>
                <Tab label="Détails" value="election-tab-0" />
                <Tab label="Calendrier" value="election-tab-1" />
                <Tab label="Statistiques / Résultats" value="election-tab-2" />
                <Tab label="Émargements" value="election-tab-3" />
              </Tabs>

              <TabPanel value="election-tab-0">
                <Main designation={designation} />
              </TabPanel>
              <TabPanel value="election-tab-1">
                <Calendar designation={designation} />
              </TabPanel>
              <TabPanel value="election-tab-2">
                <Statistics designation={designation} />
              </TabPanel>
              <TabPanel value="election-tab-3">
                <Participants designationId={designation.id} />
              </TabPanel>
            </Stack>
          </TabContext>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Show
