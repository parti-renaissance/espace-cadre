import { Box, Button as MuiButton, Checkbox, FormControlLabel, Grid, Typography } from '@mui/material'
import photo from 'assets/macron-lyon.png'
import em from 'assets/em.png'
import { styled } from '@mui/system'
import TextField from 'ui/TextField'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link as LinkRR } from 'react-router-dom'
import { useAuth } from '../../redux/auth/hooks'

const ImgContainer = styled('div')`
  display: flex;
  height: 100vh;
`

const Image = styled('img')`
  object-fit: cover;
  object-position: 100% 0;
  width: 100%;
`

const Form = styled('form')`
  display: flex;
  flex-direction: column;
  max-width: 500px;
`

const Button = styled(MuiButton)`
  color: ${({ theme }) => theme.palette.whiteCorner};
  background: ${({ theme }) => theme.palette.button.color};

  &:hover {
    background: ${({ theme }) => theme.palette.button.color};
  }
  text-transform: none;
  height: 50px;
  padding: ${({ theme }) => theme.spacing(0.75, 2)};
`

const ButtonEM = styled(MuiButton)`
  color: ${({ theme }) => theme.palette.gray500};
  background: ${({ theme }) => theme.palette.gray50};
  border-color: ${({ theme }) => theme.palette.gray500};
  &:hover {
    background: ${({ theme }) => theme.palette.gray200};
  }
  text-transform: none;
  height: 50px;
  padding: ${({ theme }) => theme.spacing(0.75, 2)};
`

const Title = styled(Typography)`
  font-size: 36px;
  font-weight: 600;
  line-height: 54px;
`
const Forgotten = styled(Typography)`
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
`

const Link = styled(LinkRR)`
  display: flex;
  align-items: center;
`

const messages = {
  connection: 'Connexion',
  jmeConnection: 'Utilisez votre compte Je m’engage pour vous connecter.',
  email: 'Email',
  password: 'Mot de passe',
  or: '------------- OU -------------',
  emConnection: 'Continuer avec mon compte En Marche',
  em: 'EM!',
  rememberme: 'Se souvenir de moi',
  forgotten: 'Mot de passe oublié ?',
  genericError: "Une erreur est survenue lors de l'authentification.",
  emailError: "Le format de l'email n'est pas valide",
  emailMandatory: 'Email obligatoire',
  passwordMandatory: 'Mot de passe obligatoire',
}

const loginSchema = Yup.object({
  login: Yup.string().email(messages.emailError).required(messages.emailMandatory),
  password: Yup.string().required(messages.passwordMandatory),
})

const Login = () => {
  const auth = useAuth()
  const onSubmit = async values => {
    try {
      await auth(values)
    } catch (e) {
      const message = e.response?.data?.message || messages.genericError
      formik.setFieldError('password', message)
    }
  }

  const formik = useFormik({
    initialValues: {
      login: '',
      password: '',
      rememberme: false,
    },
    validationSchema: loginSchema,
    onSubmit: onSubmit,
  })

  return (
    <Grid container sx={{ bgcolor: 'gray50' }}>
      <Grid item xs={7}>
        <ImgContainer>
          <Image src={photo} />
        </ImgContainer>
      </Grid>
      <Grid item xs={5} sx={{ margin: 'auto 0', display: 'flex', justifyContent: 'center' }}>
        <Form onSubmit={formik.handleSubmit}>
          <Box sx={{ color: 'gray900' }} component="span">
            <Title>{messages.connection}</Title>
          </Box>
          <Box sx={{ color: 'gray600', mb: 2 }} component="span">
            <Typography variant="subtitle1">{messages.jmeConnection}</Typography>
          </Box>
          <TextField label="login" formik={formik} placeholder={messages.email} />
          <TextField label="password" formik={formik} type="password" placeholder={messages.password} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberme"
                  size="small"
                  color="primary"
                  checked={formik.values.rememberme}
                  onChange={formik.handleChange}
                />
              }
              label={<Typography variant="subtitle2">{messages.rememberme}</Typography>}
            />
            <Link to=".">
              <Box sx={{ color: 'button.color' }} component="span">
                <Forgotten>{messages.forgotten}</Forgotten>
              </Box>
            </Link>
          </Box>
          <Button type="submit">{messages.connection}</Button>
          <Box sx={{ color: 'gray300', display: 'flex', alignSelf: 'center', my: 4.5 }} component="span">
            <Typography variant="subtitle2">{messages.or}</Typography>
          </Box>
          <ButtonEM onClick={() => {}} variant="outlined" disabled>
            <img src={em} height="23px" alt={messages.em} />
            <Box sx={{ ml: 1 }} component="span">
              {messages.emConnection}
            </Box>
          </ButtonEM>
        </Form>
      </Grid>
    </Grid>
  )
}

export default Login
