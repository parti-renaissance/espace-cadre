import { getDesignations } from '~/api/designations'
import { Box, Button, Container, Grid, Stack } from '@mui/material'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'
import Loader from '~/ui/Loader'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { useErrorHandler } from '~/components/shared/error/hooks'
import PageHeader from '~/ui/PageHeader'
import { featuresLabels } from '~/shared/features'
import { FeatureEnum } from '~/models/feature.enum'
import UICard, { Title } from '~/ui/Card'
import EmptyContent from '~/ui/EmptyContent'
import { Designation } from '~/domain/designation'

const List = () => {
  const { handleError } = useErrorHandler()
  const { isMobile } = useCurrentDeviceType()
  const { data, isFetching } = useQueryWithScope(
    ['consultations-list', { feature: 'consultations' }],
    () => getDesignations('consultation'),
    { onError: handleError }
  )

  const consultations = data as Designation[] | undefined

  return (
    <Container maxWidth={false}>
      <Box>
        <Grid container justifyContent="space-between" sx={{ mb: isMobile ? 2 : null }}>
          <PageHeader
            title={featuresLabels[FeatureEnum.CONSULTATIONS]}
            button={
              <Stack alignItems="center" direction="row" spacing={2}>
                <Button variant="contained" color="inherit" size="medium" onClick={() => {}}>
                  {"Nouveau vote d'AG"}
                </Button>
                <Button variant="contained" color="inherit" onClick={() => ''}>
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
            consultations.map(n => (
              <Grid item key={n.id} xs={12} sm={6} md={3}>
                <UICard
                  rootProps={{ sx: { borderRadius: '8px' } }}
                  headerProps={{ sx: { pt: '21px' } }}
                  header={<Title subject={n.customTitle} author={'Author'} dateTime={''} />}
                  actionsProps={{ sx: { pt: 3 } }}
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
