import { Container as MuiContainer, Grid } from '@mui/material'
import { styled } from '@mui/system'

const Container = styled(MuiContainer)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const Dashboard = () => (
  <Container maxWidth={false}>
    <Grid container>
      <Grid item xs={12}>
        <div data-featurebase-embed />
      </Grid>
    </Grid>
  </Container>
)

export default Dashboard
