import { Box, Container as MuiContainer, Grid } from '@mui/material'
import { styled } from '@mui/system'
import KpiEmailCampaign from './Charts/KpiEmailCampaign/KpiEmailCampaign'
import TextChart from './Charts/TextChart/TextChart'
import PageTitle from '~/ui/PageTitle'
import { useUserScope } from '~/redux/user/hooks'
import { FeatureEnum } from '~/models/feature.enum'

const Container = styled(MuiContainer)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const Dashboard = () => {
  const [currentScope] = useUserScope()

  return (
    <Container maxWidth={false} disableGutters={true}>
      <Grid container gap={1.5}>
        <Grid item xs={12}>
          <div {...(currentScope.hasFeature(FeatureEnum.FEATUREBASE) ? { 'data-featurebase-embed': true } : {})}>
            {!currentScope.hasFeature(FeatureEnum.FEATUREBASE) && (
              <Box sx={{ m: 3 }}>
                <PageTitle title="Vue d'ensemble" breakpoints={{ xs: 12 }} />
                <TextChart />
                <Grid item xs={12}>
                  <KpiEmailCampaign />
                </Grid>
              </Box>
            )}
          </div>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Dashboard
