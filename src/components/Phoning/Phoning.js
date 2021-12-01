import { Container, Grid } from '@mui/material'
import PageHeader from 'ui/PageHeader'

const Phoning = () => {
  return (
    <Container maxWidth="xl">
      <Grid container justifyContent="space-between">
        <PageHeader
          title="Phoning"
          message="Créer une campagne"
          parentStyles={{ color: '#4338CA', background: 'rgba(67, 56, 202, 0.08)' }}
        />
      </Grid>
    </Container>
  )
}

export default Phoning
