import { Container, Paper as MuiPaper, Button, Grid } from '@mui/material'
import { styled } from '@mui/system'
import { Link } from 'react-router-dom'

const Paper = styled(MuiPaper)`
  padding: 16px;
  text-align: center;
  border-radius: 8px;
`

const BackButton = styled(Button)(
  ({ theme }) => `
  color: ${theme.palette.whiteCorner};
  background: ${theme.palette.main};
  &:hover {
    background: ${theme.palette.main};
  }
`
)

const messages = {
  success: 'Félicitations, votre e-mail a bien été envoyé 🎉',
  back: 'Revenir à la messagerie',
}

const Confirmation = () => (
  <Container maxWidth={false}>
    <Paper>
      <Grid container sx={{ mb: 2 }}>
        <Grid item xs={12}>
          {messages.success}
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Link to="../">
            <BackButton>{messages.back}</BackButton>
          </Link>
        </Grid>
      </Grid>
    </Paper>
  </Container>
)

export default Confirmation
