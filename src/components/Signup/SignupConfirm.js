import { styled } from '@mui/system'
import { Typography } from '@mui/material'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: ${({ theme }) => theme.spacing(0, 2)};
`

const Title = styled(Typography)(
  ({ theme }) => `
  font-family: MaaxItalic;
  color: ${theme.palette.blackCorner};
  font-size: 40px;
  font-weight: 600;
  line-height: 56px;
  margin-bottom: ${theme.spacing(3)};
`
)

const Main = styled(Typography)`
  font-size: 16px;
  ${({ theme }) => theme.palette.gray600};
  font-weight: 400;
  line-height: 24px;
`

const messages = {
  title: "Je m'engage",
  subtitle: 'Vous êtes bien inscrit',
  body: 'Vous avez reçu un email pour valider votre compte et créer votre mot de passe',
}

const SignupConfirm = () => (
  <Container>
    <Title>{messages.title}</Title>
    <Main sx={{ mb: 4 }}>{messages.subtitle}</Main>
    <Main>{messages.body}</Main>
  </Container>
)

export default SignupConfirm
