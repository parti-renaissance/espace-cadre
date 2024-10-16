import { useParams } from 'react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { cancelDesignation, getDesignation } from '~/api/designations'
import Loader from '~/ui/Loader'
import { Box, Button, Chip, Container, Grid, Stack, Typography } from '@mui/material'
import PageHeader from '~/ui/PageHeader'
import { FeatureEnum } from '~/models/feature.enum'
import paths from '~/shared/paths'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'
import Iconify from '~/mui/iconify'
import { useNavigate } from 'react-router-dom'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { notifyVariants } from '~/components/shared/notification/constants'
import ConfirmButton from '~/ui/Button/ConfirmButton'
import { nl2br } from '~/components/shared/helpers'
import { AccessTime, DateRange } from '@mui/icons-material'
import { formatDate } from '~/shared/helpers'
import { useErrorHandler } from '~/components/shared/error/hooks'
import Badge from '~/ui/Badge/Badge'
import { find } from 'lodash'
import { useTargetYearChoices } from '~/components/Consultations/Edit/form'

const Show = () => {
  const { isMobile } = useCurrentDeviceType()
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError } = useErrorHandler()
  const targetChoices = useTargetYearChoices()
  const navigate = useNavigate()
  const { uuid } = useParams()
  const {
    data: designation,
    isFetching,
    refetch,
  } = useQuery(['designation', uuid], () => getDesignation(uuid as string))

  const { mutate, isLoading } = useMutation((id: string) => cancelDesignation(id), {
    onSuccess: () => {
      enqueueSnackbar('La consultation a été annulée', notifyVariants.success)
      refetch()
    },
    onError: handleError,
  })

  if (isFetching) {
    return <Loader isCenter />
  }

  if (!designation) {
    enqueueSnackbar("La consultation n'existe pas 🤷", notifyVariants.error)
    navigate(paths[FeatureEnum.DESIGNATION])
    return null
  }

  return (
    <Container maxWidth={false}>
      <Box>
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
                onClick={() => {
                  navigate(paths[FeatureEnum.DESIGNATION])
                }}
              >
                Retour
              </Button>
            }
            button={
              !designation.isCanceled && (
                <Stack alignItems="center" direction="row" spacing={2}>
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
                    title={'Annulation de la consultation'}
                    description={'Êtes-vous sûr de vouloir annuler la consultation ?'}
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
          {isFetching ? (
            <Loader isCenter />
          ) : (
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Stack spacing={2} mt={2} marginLeft={2} marginY={2}>
                  <Stack direction={'row'} alignItems={'center'}>
                    <DateRange sx={{ mr: 0.5, color: 'colors.gray.400', fontSize: '15px' }} />
                    <Typography variant="subtitle2" sx={{ color: 'colors.gray.500' }}>
                      Date, heure du vote
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography sx={{ color: 'colors.gray.500' }}>
                      Début le {formatDate(designation.voteStartDate, 'dd/MM/yyyy à HH:mm')}
                    </Typography>
                    <Typography sx={{ color: 'colors.gray.500' }}>
                      Fin le {formatDate(designation.voteEndDate, 'dd/MM/yyyy à HH:mm')}
                    </Typography>
                  </Stack>
                  <Stack direction={'row'} alignItems={'center'}>
                    <AccessTime sx={{ mr: 0.5, color: 'colors.gray.400', fontSize: '15px' }} />
                    <Typography variant="subtitle2" sx={{ color: 'colors.gray.500' }}>
                      Créé Le {formatDate(designation.createdAt, 'dd/MM/yyyy à HH:mm')}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography sx={{ textWrap: 'nowrap' }}>Personnes concernées :</Typography>
                    <Chip
                      key={designation.targetYear}
                      label={find(targetChoices, { value: designation.targetYear })?.label}
                      sx={{ marginRight: 1 }}
                    />
                  </Stack>
                  <Typography>{nl2br(designation.description)}</Typography>
                </Stack>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  )
}

export default Show
