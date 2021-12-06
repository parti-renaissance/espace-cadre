import { Container, Grid, Paper, Card, CardHeader, CardContent, Typography } from '@mui/material'
import { styled } from '@mui/system'
import PageHeader from 'ui/PageHeader'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useQuery } from 'react-query'
import { getGlobalKpiQuery } from 'api/phoning'

const CardWrapper = styled(props => <Grid item {...props} />)`
  flex-grow: 1;
`

const Title = styled(Typography)(
  ({ theme }) => `
	margin: ${theme.spacing(1, 0, 2, 1)};
	font-size: 18px;
	font-weight: 400px;
`
)

const messages = {
  title: 'Phoning',
  actionButtonText: 'Créer une campagne',
}

const Phoning = () => {
  const handleNewCampaign = () => {}
  const { handleError } = useErrorHandler()

  const { data: globalKpi = [] } = useQuery('globalKpi', () => getGlobalKpiQuery(), { onError: handleError })

  return (
    <Container maxWidth="xl">
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          message={messages.actionButtonText}
          parentStyles={{ color: '#4338CA', background: 'rgba(67, 56, 202, 0.08)' }}
          handleAction={handleNewCampaign}
        />
      </Grid>
      <Paper sx={{ p: 2, background: '#E5E7EB', borderRadius: '12px' }}>
        <Grid container>
          <Title>Indicateurs</Title>
        </Grid>
        <Grid container spacing={2}>
          {/* {[...Array(5).keys()].map(index => (
            <CardWrapper key={index + 1} lg={2.4} xl={2.4}>
              <Card>
                <CardHeader title="Title" />
                <CardContent>Lorem ipsum fluctuat nec mergitur</CardContent>
              </Card>
            </CardWrapper>
          ))} */}
        </Grid>
      </Paper>
    </Container>
  )
}

export default Phoning
