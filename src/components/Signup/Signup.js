import { styled } from '@mui/system'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { TextField, TextFieldFormik } from './TextField'
import { Box, Button, Checkbox, FormControlLabel, Typography } from '@mui/material'
import { getDaysInMonth } from 'date-fns'
import { useMemo, useState } from 'react'
import prefixes from './prefixes.json'
import { getCountryCallingCode, isValidPhoneNumber } from 'libphonenumber-js'
import Places from 'components/Signup/Places'
import { signup as signupQuery } from 'api/signup'
import UISelect from 'ui/Select/Select'
import { useMutation, useQuery } from 'react-query'
import { rgpd as rgpdQuery } from 'api/rgpd'
import AlertBanner from 'ui/AlertBanner'
import { getFormattedErrorMessages } from 'components/shared/error/helpers'
import SignupOk from 'components/Signup/SignupOk'
import { genders, months, years } from 'components/Signup/data'

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
const Title = styled(Typography)`
  font-family: MaaxItalic;
  font-size: 40px;
  font-weight: 500;
  line-height: 56px;
`
const SubTitle = styled(Typography)`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
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
const messages = {
  optional: '(optionnel)',
  jme: "Je m'engage",
  createAccount: 'Créez votre compte pour vous engager sur le terrain.',
  personnalInformations: 'Informations personnelles',
  email: 'Adresse e-mail',
  firstName: 'Prénom',
  lastName: 'Nom',
  gender: 'Genre',
  birthdate: 'Date de naissance',
  dd: 'Jour',
  mm: 'Mois',
  yyyy: 'Année',
  address: 'Adresse',
  prefix: 'Indicatif',
  phone: 'Téléphone ',
  cgu: "Oui, j'adhère aux conditions générales d'utilisation et à la politique de protection des données à caractère personnel.",
  mobileNotification: 'Je souhaite recevoir des notifications par sms ',
  emailNotification: 'Je souhaite recevoir des notifications par email ',
  adress: 'Numéro et rue',
  postalCode: 'CP',
  city: 'Ville',
  country: 'Pays',
  submit: "Je m'inscris",
  mandatory: 'Champ obligatoire',
  emailError: "Le format de l'email n'est pas valide",
  min2: '2 charactères minimum',
  cguMandatory: 'Vous devez accepter les CGU',
}

const mapErrorToField = {
  email_address: 'email',
  first_name: 'firstName',
  last_name: 'lastName',
  gender: 'gender',
  birthdate: 'birthdate',
  phone: 'phone',
  address: 'address',
  cgu_accepted: 'cgu',
  'address.address': 'address',
  'address.country': 'address',
  'address.postal_code': 'address',
  'address.city_name': 'address',
}

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
  const [signupOk, setSignupOk] = useState(false)

  const onSubmit = async values => {
    const gresponse = await window.grecaptcha.enterprise.getResponse()
    await signup({
      email_address: values.email,
      first_name: values.firstName,
      last_name: values.lastName,
      gender: values.gender,
      birthdate: values.birthdate,
      phone: values.phone,
      address: {
        address: [address.number, address.number && ' ', address.route].filter(Boolean).join(),
        postal_code: address.postalCode,
        city_name: address.locality,
        country: address.country,
      },
      cgu_accepted: values.cgu,
      allow_mobile_notifications: values.mobileNotification,
      allow_email_notifications: values.emailNotification,
      g_recaptcha_response: gresponse,
    })
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      gender: '',
      birthdate: new Date(),
      prefix: 'FR',
      phone: '',
      cgu: false,
      mobileNotification: false,
      emailNotification: false,
    },
    validationSchema: signupSchema,
    onSubmit: onSubmit,
  })

  const updateAddress = adr => {
    setAddress(adr)
    formik.setFieldValue('address', adr.route)
  }

  const { data: rgpd } = useQuery('rgpd', rgpdQuery, {
    enabled: true,
  })

  const { mutateAsync: signup, isLoading: isLoading } = useMutation(signupQuery, {
    onSuccess: () => {
      setSignupOk(true)
    },
    onError: e => {
      const { data } = e.response
      const errorMessages = getFormattedErrorMessages(data)
      errorMessages?.forEach(e => {
        const field = mapErrorToField[e.field]
        field && formik.setFieldError(field, e.message)
      })
    },
  })

  const isPhoneValid = useMemo(() => {
    const phoneNumber = formik.values.phone
    if (phoneNumber === '') return true

    const country = formik.values.prefix
    return isValidPhoneNumber(phoneNumber, country)
  }, [formik.values])

  const setDate = (v, field) => {
    setBirthdate(prevState => ({ ...prevState, [field]: v }))
  }

  const days = useMemo(
    () =>
      new Array(getDaysInMonth(new Date(parseInt(birthdate.year), parseInt(birthdate.month) - 1)))
        .fill('')
        .map((_, i) => i + 1)
        .map(d => ({ key: d < 10 ? `0${d}` : String(d), value: String(d) })),
    [birthdate.month, birthdate.year]
  )

  if (signupOk) return <SignupOk />
  return (
    <Page>
      <Container>
        <Title>{messages.jme}</Title>
        <SubTitle sx={{ mt: 3, mb: 4.5 }}>{messages.createAccount}</SubTitle>
        <Form onSubmit={formik.handleSubmit}>
          <Header sx={{ mb: 1 }}>{messages.personnalInformations}</Header>
          <TextFieldFormik
            label="firstName"
            formik={formik}
            placeholder={messages.firstName}
            inputProps={{ maxLength: 50 }}
            sx={{}}
          />
          <TextFieldFormik
            label="lastName"
            formik={formik}
            placeholder={messages.lastName}
            inputProps={{ maxLength: 50 }}
            sx={{ mt: 3 }}
          />
          <UISelect
            options={genders}
            onChange={v => {
              formik.setFieldValue('gender', v)
            }}
            value={formik.values.gender}
            placeholder={messages.gender}
            error={!!formik.touched.gender && !!formik.errors.gender}
            sx={{ mt: 3 }}
          />
          {formik.touched.gender && formik.errors.gender && (
            <AlertBanner severity="error" message={formik.errors.gender} />
          )}
          <TextFieldFormik
            label="email"
            formik={formik}
            placeholder={messages.email}
            inputProps={{ maxLength: 255 }}
            sx={{ mt: 3 }}
          />
          <Header sx={{ mt: 3 }}>{messages.birthdate}</Header>
          <Box component="div" sx={{ display: 'flex', mt: 1 }}>
            <UISelect
              options={days}
              onChange={d => setDate(d, 'day')}
              value={birthdate.day}
              placeholder={messages.dd}
              sx={{ flex: 1 }}
            />
            <UISelect
              options={months}
              onChange={m => setDate(m, 'month')}
              value={birthdate.month}
              placeholder={messages.mm}
              sx={{ flex: 1, mx: 2 }}
            />
            <UISelect
              options={years}
              onChange={y => setDate(y, 'year')}
              value={birthdate.year}
              placeholder={messages.yyyy}
              sx={{ flex: 1 }}
            />
          </Box>
          <Header sx={{ mt: 3 }}>{messages.address}</Header>
          <Places onSelectPlace={updateAddress} sx={{ mt: 1 }} error={formik.touched.gender && formik.errors.address} />
          <Box component="div" sx={{ display: 'flex', mt: 3 }}>
            <TextField value={address?.postalCode} placeholder={messages.postalCode} disabled sx={{ flex: 1 }} />
            <TextField value={address?.locality} placeholder={messages.city} disabled sx={{ flex: 3, mx: 2 }} />
            <TextField value={address?.country} placeholder={messages.country} disabled sx={{ flex: 1 }} />
          </Box>
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
                color="primary"
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
                color="primary"
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
                color="primary"
                checked={formik.values.cgu}
                onChange={formik.handleChange}
              />
            }
            label={<Typography variant="subtitle2">{messages.cgu}</Typography>}
            sx={{ mx: 1, mb: 3 }}
          />
          <div className="g-recaptcha" data-sitekey="6LdEMgoeAAAAABdXBciYWKZ5dHDVmpdCSvwZ4pSE" />
          <Button
            type="submit"
            variant="outlined"
            disabled={!isPhoneValid || isLoading || Object.keys(formik.errors).length > 0}
            sx={{ color: 'whiteCorner', bgcolor: 'button.color', my: 4.5, height: '52px' }}
          >
            {messages.submit}
          </Button>
          <Typography variant="subtitle2">{rgpd?.content}</Typography>
        </Form>
      </Container>
    </Page>
  )
}

export default Signup
