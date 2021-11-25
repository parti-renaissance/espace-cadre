import { CircularProgress, Grid } from '@mui/material'

const spinerMessages = {
  loading: 'Page en cours de chargement',
}
const Spinner = () => (
  <Grid container style={{ marginTop: 'calc(100vh - 70vh)', textAlign: 'center' }}>
    <Grid item xs={12}>
      <CircularProgress sx={{ color: '#0049C6' }} />
    </Grid>
    <Grid item xs={12}>
      <strong>{spinerMessages.loading}</strong>
    </Grid>
  </Grid>
)

export default Spinner
