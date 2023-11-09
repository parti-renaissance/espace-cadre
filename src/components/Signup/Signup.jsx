import { useMemo, useState } from 'react'
import { styled } from '@mui/system'
import { Box, Button, FormControlLabel, Typography, Grid } from '@mui/material'
import { Checkbox } from 'ui/Checkbox/Checkbox'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { getCountryCallingCode, isValidPhoneNumber } from 'libphonenumber-js'
import { getDaysInMonth } from 'date-fns'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { signupQuery } from 'api/signup'
import { RGPDQuery } from 'api/legal'
import { getFormattedErrorMessages } from 'components/shared/error/helpers'
import Places from 'ui/Places/Places'
import { genders, months, years } from './data/data'
import { TextField, TextFieldFormik } from './components/TextField'
import prefixes from './data/prefixes.json'
import UISelect from 'ui/Select/Select'
import AlertBanner from 'ui/AlertBanner'
import { messages, placeholders, errorFields } from './data/wording'
import { publicPaths } from 'shared/paths'
import { parseDate } from 'shared/helpers'

const Page = styled('div')(
  ({ theme }) => `
  display: flex;
  background-color : ${theme.palette.whiteCorner};
`
)
const Container = styled('div')(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  ${theme.breakpoints.down('sm')} {
    width: 300px;
  };
  margin: ${theme.spacing(6, 'auto')};
  background-color : ${theme.palette.whiteCorner};
`
)

const SubmitButton = styled(Button)(
  ({ theme }) => `
  color: ${theme.palette.whiteCorner};
  background-color: ${theme.palette.signupButton.background.main};
  &:hover {
    background-color: ${theme.palette.signupButton.background.hover};
  };
  margin: ${theme.spacing(4.5, 0)};
  height: 56px;
`
)

const Title = styled(Typography)`
  font-family: MaaxItalic;
  font-size: 40px;
  line-height: 40px;
  font-weight: 600;
`
const SubTitle = styled(Typography)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
`
const Header = styled(Typography)`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`
const Italic = styled(Typography)`
  font-style: italic;
  font-size: inherit;
  font-weight: 400;
  line-height: inherit;
`
const Form = styled('form')`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const signupSchema = Yup.object({
  email: Yup.string().email(messages.emailError).required(messages.mandatory),
  firstName: Yup.string().min(2, messages.min2).required(messages.mandatory),
  lastName: Yup.string().min(2, messages.min2).required(messages.mandatory),
  gender: Yup.string().required(messages.mandatory),
  birthdate: Yup.string(),
  prefix: Yup.string().min(2, messages.mandatory),
  cgu: Yup.bool().oneOf([true], messages.cguMandatory),
  address: Yup.string().required(messages.mandatory),
})

const Signup = () => {
  const [birthdate, setBirthdate] = useState({ day: '01', month: '01', year: '2000' })
  const [address, setAddress] = useState(null)
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      gender: '',
      prefix: 'FR',
      phone: '',
      cgu: false,
      mobileNotification: false,
      emailNotification: false,
    },
    validationSchema: signupSchema,
    onSubmit: values => {
      signup({ ...values, address, birthdate })
    },
  })

  const updateAddress = adr => {
    setAddress(adr)
    formik.setFieldValue('address', adr.route)
  }

  const { data: rgpd } = useQuery(['RGPD', { feature: 'Signup', view: 'Signup' }], () => RGPDQuery())

  const { mutateAsync: signup, isLoading: isLoading } = useMutation(signupQuery, {
    onSuccess: () => {
      navigate(publicPaths.signupConfirm)
    },
    onError: e => {
      const { data } = e.response
      const errorMessages = getFormattedErrorMessages(data)
      errorMessages?.forEach(e => {
        const field = errorFields[e.field]
        field && formik.setFieldError(field, e.message)
      })
    },
  })

  const isPhoneValid = useMemo(() => {
    const phoneNumber = formik.values.phone
    if (phoneNumber === '') {
      return true
    }

    const country = formik.values.prefix
    return isValidPhoneNumber(phoneNumber, country)
  }, [formik.values])

  const setDate = (v, field) => {
    setBirthdate(prevState => ({ ...prevState, [field]: v }))
  }

  const days = useMemo(
    () =>
      new Array(getDaysInMonth(parseDate(parseInt(birthdate.year), parseInt(birthdate.month) - 1)))
        .fill('')
        .map((_, i) => i + 1)
        .map(d => ({ key: d < 10 ? `0${d}` : String(d), value: String(d) })),
    [birthdate.month, birthdate.year]
  )

  return (
    <Page>
      <Container>
        <Title>{messages.app_name}</Title>
        <SubTitle sx={{ mt: 3, mb: 4.5 }}>{messages.createAccount}</SubTitle>
        <Form onSubmit={formik.handleSubmit}>
          <Header sx={{ mb: 1 }}>{messages.personalInformations}</Header>
          <TextFieldFormik
            label="firstName"
            formik={formik}
            placeholder={placeholders.firstName}
            inputProps={{ maxLength: 50 }}
          />
          <TextFieldFormik
            label="lastName"
            formik={formik}
            placeholder={placeholders.lastName}
            inputProps={{ maxLength: 50 }}
            sx={{ mt: 2 }}
          />
          <UISelect
            options={genders}
            onChange={v => {
              formik.setFieldValue('gender', v)
            }}
            value={formik.values.gender}
            placeholder={placeholders.gender}
            error={!!formik.touched.gender && !!formik.errors.gender}
            sx={{ mt: 2 }}
          />
          {formik.touched.gender && formik.errors.gender && (
            <AlertBanner severity="error" message={formik.errors.gender} />
          )}
          <TextFieldFormik
            label="email"
            formik={formik}
            placeholder={placeholders.email}
            inputProps={{ maxLength: 255 }}
            sx={{ mt: 2 }}
          />
          <Header sx={{ mt: 3 }}>{messages.birthdate}</Header>
          <Box component="div" sx={{ display: 'flex', mt: 1 }}>
            <UISelect
              options={days}
              onChange={d => setDate(d, 'day')}
              value={birthdate.day}
              placeholder={placeholders.dd}
              sx={{ flex: 1 }}
            />
            <UISelect
              options={months}
              onChange={m => setDate(m, 'month')}
              value={birthdate.month}
              placeholder={placeholders.mm}
              sx={{ flex: 1, mx: 2 }}
            />
            <UISelect
              options={years}
              onChange={y => setDate(y, 'year')}
              value={birthdate.year}
              placeholder={placeholders.yyyy}
              sx={{ flex: 1 }}
            />
          </Box>
          <Header sx={{ mt: 3 }}>{messages.address}</Header>
          <Places onSelectPlace={updateAddress} sx={{ mt: 1 }} error={formik.touched.gender && formik.errors.address} />
          <Grid
            container
            spacing={2}
            sx={{
              pt: 1,
            }}
          >
            <Grid item xs={12} sm={3}>
              <TextField
                value={address?.postalCode}
                placeholder={placeholders.postalCode}
                disabled
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField value={address?.locality} placeholder={placeholders.city} disabled sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField value={address?.country} placeholder={placeholders.country} disabled sx={{ width: '100%' }} />
            </Grid>
          </Grid>
          <Header sx={{ mt: 3 }}>
            {messages.phone}
            <Italic>{messages.optional}</Italic>
          </Header>
          <Box component="div" sx={{ display: 'flex', mt: 1 }}>
            <UISelect
              options={prefixes}
              onChange={v => {
                formik.setFieldValue('prefix', v)
              }}
              value={formik.values.prefix}
              renderValue={selected => `+${getCountryCallingCode(selected)}`}
              sx={{ mr: 2 }}
            />
            <TextFieldFormik
              label="phone"
              formik={formik}
              placeholder={messages.phone}
              inputProps={{ maxLength: 15 }}
            />
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                name="emailNotification"
                size="small"
                checked={formik.values.emailNotification}
                onChange={formik.handleChange}
              />
            }
            label={
              <Typography variant="subtitle2">
                {messages.emailNotification}
                <Italic>{messages.optional}</Italic>
              </Typography>
            }
            sx={{ mx: 1, mt: 3 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="mobileNotification"
                size="small"
                checked={formik.values.mobileNotification}
                onChange={formik.handleChange}
              />
            }
            label={
              <Typography variant="subtitle2">
                {messages.mobileNotification}
                <Italic>{messages.optional}</Italic>
              </Typography>
            }
            sx={{ mx: 1, mb: 1 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                sx={formik.errors.cgu ? { color: 'red' } : {}}
                name="cgu"
                size="small"
                checked={formik.values.cgu}
                onChange={formik.handleChange}
              />
            }
            label={
              <Typography variant="subtitle2">
                {messages.cguPrefix}&nbsp;
                <Link to={publicPaths.cguWeb}>
                  <Typography variant="subtitle2" sx={{ color: '#2834C3' }}>
                    {messages.cgu}
                  </Typography>
                </Link>
                &nbsp;
                {messages.ppdPrefix}
                &nbsp;
                <Link to={publicPaths.ppd}>
                  <Typography variant="subtitle2" sx={{ color: '#2834C3' }}>
                    {messages.ppd}
                  </Typography>
                </Link>
              </Typography>
            }
            sx={{ mx: 1, mb: 3 }}
          />
          {formik.errors.cgu && <AlertBanner severity="error" message={formik.errors.cgu} />}
          <SubmitButton
            type="submit"
            variant="outlined"
            disabled={!isPhoneValid || isLoading || Object.keys(formik.errors).length > 0}
          >
            {messages.submit}
          </SubmitButton>
          <Typography variant="subtitle2">{rgpd?.content}</Typography>
        </Form>
      </Container>
    </Page>
  )
}

export default Signup
