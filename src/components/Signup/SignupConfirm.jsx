import { styled } from '@mui/system'
import { Typography, Grid } from '@mui/material'

const Title = styled(Typography)(
  ({ theme }) => `
  font-family: Maax;
  color: ${theme.palette.blackCorner};
  font-size: 40px;
  font-weight: 600;
  line-height: 56px;
  margin-bottom: ${theme.spacing(3)};
`
)

const messages = {
  title: 'Espace cadre',
  subtitle: 'Vous êtes bien inscrit',
  body: 'Vous avez reçu un email pour valider votre compte et créer votre mot de passe',
}

const SignupConfirm = () => (
  <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ height: '100vh', px: 2, py: 0 }}>
    <Title>{messages.title}</Title>
    <Typography variant="subtitle1" sx={{ fontWeight: 400, color: 'gray600', mb: 4 }}>
      {messages.subtitle}
    </Typography>
    <Typography variant="subtitle1" sx={{ fontWeight: 400, color: 'gray600' }}>
      {messages.body}
    </Typography>
  </Grid>
)

export default SignupConfirm
