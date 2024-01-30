import { Grid } from '@mui/material'
import Loader from '~/ui/Loader'

const BootPage = () => (
  <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', width: '100vw' }}>
    <Loader size={30} color="main" />
  </Grid>
)

export default BootPage
