import { getDesignations } from '~/api/designations'
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'
import Loader from '~/ui/Loader'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { useErrorHandler } from '~/components/shared/error/hooks'
import PageHeader from '~/ui/PageHeader'
import { featuresLabels } from '~/shared/features'
import { FeatureEnum } from '~/models/feature.enum'
import UICard from '~/ui/Card'
import EmptyContent from '~/ui/EmptyContent'
import { Designation, DesignationTypeEnum } from '~/domain/designation'
import { useNavigate } from 'react-router-dom'
import { paths as componentPaths } from '~/components/Consultations/paths'
import paths from '~/shared/paths'
import { AccessTime, DateRange } from '@mui/icons-material'
import { formatDate } from '~/shared/helpers'
import Iconify from '~/mui/iconify'
import Badge from '~/ui/Badge/Badge'

const List = () => {
  const navigate = useNavigate()
  const { handleError } = useErrorHandler()
  const { isMobile } = useCurrentDeviceType()
  const { data, isFetching } = useQueryWithScope(
    ['consultations-list', { feature: 'consultations' }],
    () => getDesignations(DesignationTypeEnum.Consultation),
    { onError: handleError }
  )

  const consultations = data as Designation[] | undefined

  return (
    <Container maxWidth={false}>
      <Box>
        <Grid container justifyContent="space-between" sx={{ mb: isMobile ? 2 : null }}>
          <PageHeader
            title={featuresLabels[FeatureEnum.DESIGNATION]}
            button={
              <Stack alignItems="center" direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(paths[FeatureEnum.DESIGNATION] + componentPaths.new_ag_vote)}
                >
                  Nouveau vote AG
                </Button>
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={() => navigate(paths[FeatureEnum.DESIGNATION] + componentPaths.new_consultation)}
                >
                  Nouvelle consultation
                </Button>
              </Stack>
            }
          />
        </Grid>
        <Grid container spacing={2} sx={{ mt: 0, ...(isMobile && { pt: 2 }) }}>
          {isFetching ? (
            <Loader isCenter />
          ) : consultations?.length ? (
            consultations.map(consultation => (
              <Grid item key={consultation.id} xs={12} sm={6} md={3}>
                <UICard
                  rootProps={{ sx: { pt: 2 } }}
                  header={
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography component="h2" sx={{ fontWeight: '500', color: 'colors.gray.900', fontSize: '16px' }}>
                        {consultation.customTitle}
                      </Typography>
                      {consultation.isCanceled && (
                        <Badge
                          badge={{
                            label: 'Annulée',
                            badgeOptions: { color: 'colors.red.400', bgcolor: 'colors.red.100' },
                          }}
                        />
                      )}
                    </Stack>
                  }
                  content={
                    <Stack className="space-y-3">
                      <Stack direction={'row'} alignItems={'center'}>
                        <DateRange sx={{ mr: 0.5, color: 'colors.gray.400', fontSize: '15px' }} />
                        <Typography variant="subtitle2" sx={{ color: 'colors.gray.500' }}>
                          Date, heure du vote
                        </Typography>
                      </Stack>
                      <Stack>
                        <Typography sx={{ color: 'colors.gray.500' }}>
                          Début le {formatDate(consultation.voteStartDate, 'dd/MM/yyyy à HH:mm')}
                        </Typography>
                        <Typography sx={{ color: 'colors.gray.500' }}>
                          Fin le {formatDate(consultation.voteEndDate, 'dd/MM/yyyy à HH:mm')}
                        </Typography>
                      </Stack>
                      <Stack direction={'row'} alignItems={'center'}>
                        <AccessTime sx={{ mr: 0.5, color: 'colors.gray.400', fontSize: '15px' }} />
                        <Typography variant="subtitle2" sx={{ color: 'colors.gray.500' }}>
                          Créé Le {formatDate(consultation.createdAt, 'dd/MM/yyyy à HH:mm')}
                        </Typography>
                      </Stack>
                    </Stack>
                  }
                  actions={
                    <Box sx={{ display: 'flex', justifyContent: 'end', width: '100%' }}>
                      <Button
                        variant={'contained'}
                        onClick={() => navigate(paths[FeatureEnum.DESIGNATION] + '/' + consultation.id)}
                        startIcon={<Iconify icon={'eva:eye-outline'} />}
                      >
                        Voir
                      </Button>
                    </Box>
                  }
                />
              </Grid>
            ))
          ) : (
            <EmptyContent description={'Aucun élément'} />
          )}
        </Grid>
      </Box>
    </Container>
  )
}

export default List
