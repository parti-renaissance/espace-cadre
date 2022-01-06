import { Container, Grid } from '@mui/material'
import bootPage from 'assets/bootPage.svg'

const messages = {
  welcome: "L'application sera bientôt prête",
}

function BootPage() {
  return (
    <Container maxWidth="xl" sx={{ mt: 'calc(100vh - 80vh)', textAlign: 'center' }}>
      <Grid container>
        <Grid item xs={12} sx={{ m: 'theme.spacing(6, 0)' }}>
          <h2>{messages.welcome}</h2>
        </Grid>
        <Grid item xs={12}>
          <img src={bootPage} alt="loading" />
        </Grid>
      </Grid>
    </Container>
  )
}

export default BootPage
