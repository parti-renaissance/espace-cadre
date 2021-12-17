import PropTypes from 'prop-types'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { useFormikContext } from 'formik'
import DatePicker from '@mui/lab/DatePicker'
import { Autocomplete, FormControlLabel, Grid, InputAdornment, MenuItem, Typography } from '@mui/material'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'

import { useErrorHandler } from 'components/shared/error/hooks'
import { FormError } from 'components/shared/error/components'
import { getPhoningCampaignZones } from 'api/phoning'
import { Checkbox, Input, Label } from '../shared/components'

const messages = {
  input: {
    gender: 'Genre',
    firstName: 'Prénom',
    lastName: 'Nom',
    ageMin: 'Age minimum',
    ageMax: 'Age maximum',
    adherentFromDate: 'Adhérent depuis le',
    adherentToDate: "Adhérent jusqu'au",
    certified: 'Certifié',
    committeeMember: "Membre d'un comité",
    emailSubscribed: 'Abonné Email',
    SMSSubscribed: 'Abonné SMS',
    zones: 'Zones',
  },
  placeholder: {
    gender: 'Genre',
    firstName: "Prénom de l'adhérent",
    lastName: "Nom de l'adhérent",
    ageMin: '17',
    ageMax: '77',
    adherentFromDate: '__  /__  /____',
    adherentToDate: '__  /__  /____',
    zones: 'Lieu géographique',
  },
  options: {
    gender: [
      { label: 'Homme', value: 'Male' },
      { label: 'Femme', value: 'Female' },
    ],
  },
  pleaseWait: 'Veuillez patienter..',
  noResult: 'Aucun résultat à afficher',
}

const Filters = ({ errors = [] }) => {
  const [zoneInputValue, setZoneInputValue] = useState('')
  const { values, setFieldValue } = useFormikContext()
  const { handleError, errorMessages } = useErrorHandler()

  const { data: zones = [], isFetching: isZonesFetching } = useQuery(
    ['zones', zoneInputValue],
    () => getPhoningCampaignZones(zoneInputValue),
    {
      enabled: !!zoneInputValue && zoneInputValue !== values?.filters?.zones?.name,
      onError: handleError,
    }
  )

  return (
    <>
      <Grid container direction="row" spacing={2}>
        <Grid item xs={6}>
          <Label sx={{ pt: 3, pb: 1 }}>{messages.input.gender}</Label>
          <Input
            name="gender"
            placeholder={messages.placeholder.gender}
            value={values?.filters?.gender}
            onChange={event => {
              setFieldValue('filters.gender', event.target.value)
            }}
            select
            autoFocus
          >
            {messages.options.gender.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Input>
          <FormError errors={errors} field="gender" />
        </Grid>
      </Grid>

      <Grid container direction="row" spacing={2}>
        <Grid item xs={6}>
          <Label sx={{ pt: 3, pb: 1 }}>{messages.input.firstName}</Label>
          <Input
            name="firstName"
            placeholder={messages.placeholder.firstName}
            value={values?.filters?.firstName}
            onChange={event => {
              setFieldValue('filters.firstName', event.target.value)
            }}
          />
          <FormError errors={errors} field="first_name" />
        </Grid>
        <Grid item xs={6}>
          <Label sx={{ pt: 3, pb: 1 }}>{messages.input.lastName}</Label>
          <Input
            name="lastName"
            placeholder={messages.placeholder.lastName}
            value={values?.filters?.lastName}
            onChange={event => {
              setFieldValue('filters.lastName', event.target.value)
            }}
          />
          <FormError errors={errors} field="last_name" />
        </Grid>
      </Grid>

      <Grid container direction="row" spacing={2}>
        <Grid item xs={6}>
          <Label sx={{ pt: 3, pb: 1 }}>{messages.input.ageMin}</Label>
          <Input
            type="number"
            name="ageMin"
            placeholder={messages.placeholder.ageMin}
            value={values?.filters?.ageMin}
            onChange={event => {
              setFieldValue('filters.ageMin', event.target.value)
            }}
          />
          <FormError errors={errors} field="age_min" />
        </Grid>
        <Grid item xs={6}>
          <Label sx={{ pt: 3, pb: 1 }}>{messages.input.ageMax}</Label>
          <Input
            type="number"
            name="ageMax"
            placeholder={messages.placeholder.ageMax}
            value={values?.filters?.ageMax}
            onChange={event => {
              setFieldValue('filters.ageMax', event.target.value)
            }}
          />
          <FormError errors={errors} field="age_max" />
        </Grid>
      </Grid>

      <Grid container direction="row" spacing={2}>
        <Grid item xs={6}>
          <Label sx={{ pt: 3, pb: 1 }}>{messages.input.adherentFromDate}</Label>
          <DatePicker
            inputFormat="dd/MM/yyyy"
            value={values?.filters?.adherentFromDate}
            onChange={value => {
              setFieldValue('filters.adherentFromDate', value)
            }}
            renderInput={props => <Input type="date" name="adherentFromDate" {...props} />}
            inputProps={{ placeholder: messages.placeholder.adherentFromDate }}
            components={{ OpenPickerIcon: props => <CalendarTodayRoundedIcon size="small" {...props} /> }}
            InputAdornmentProps={{
              position: 'start',
              component: ({ children, ...props }) => (
                <InputAdornment position="start" sx={{ pl: 2 }} {...props}>
                  {children}
                </InputAdornment>
              ),
            }}
          />
          <FormError errors={errors} field="registered_since" />
        </Grid>
        <Grid item xs={6}>
          <Label sx={{ pt: 3, pb: 1 }}>{messages.input.adherentToDate}</Label>
          <DatePicker
            inputFormat="dd/MM/yyyy"
            value={values?.filters?.adherentToDate}
            onChange={value => {
              setFieldValue('filters.adherentToDate', value)
            }}
            renderInput={props => <Input type="date" name="adherentToDate" {...props} />}
            inputProps={{ placeholder: messages.placeholder.adherentToDate }}
            components={{ OpenPickerIcon: props => <CalendarTodayRoundedIcon size="small" {...props} /> }}
            InputAdornmentProps={{
              position: 'start',
              component: ({ children, ...props }) => (
                <InputAdornment position="start" sx={{ pl: 2 }} {...props}>
                  {children}
                </InputAdornment>
              ),
            }}
          />
          <FormError errors={errors} field="registered_until" />
        </Grid>
      </Grid>

      <Grid item>
        <Label sx={{ pt: 3, pb: 1 }}>{messages.input.zones}</Label>
        <Autocomplete
          options={zones}
          inputValue={zoneInputValue}
          value={values?.filters?.zones}
          limitTags={3}
          onInputChange={(_, value) => {
            setZoneInputValue(value)
          }}
          onChange={(_, value) => {
            setFieldValue('filters.zones', value)
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={option => option.name || option}
          renderOption={(props, option, { selected }) => (
            <MenuItem {...props} key={option.id}>
              <Checkbox checked={selected} />
              <Typography>
                {option.name} ({option.code})
              </Typography>
            </MenuItem>
          )}
          renderInput={params => <Input name="zones" placeholder={messages.placeholder.zones} {...params} />}
          loading={isZonesFetching}
          loadingText={messages.pleaseWait}
          noOptionsText={messages.noResult}
          multiple
          autoComplete
          fullWidth
        />
        <FormError errors={errorMessages} field="zones" />
      </Grid>

      <Grid container direction="row" spacing={2}>
        <Grid container direction="column" item xs={6}>
          <Grid item>
            <FormControlLabel
              label={messages.input.certified}
              control={<Checkbox checked={!!values?.filters?.certified} />}
              onChange={(_, value) => {
                setFieldValue('filters.certified', value)
              }}
              sx={{ pt: 3 }}
            />
            <FormError errors={errors} field="is_certified" />
          </Grid>
          <Grid item>
            <FormControlLabel
              label={messages.input.committeeMember}
              control={<Checkbox checked={!!values?.filters?.committeeMember} />}
              onChange={(_, value) => {
                setFieldValue('filters.committeeMember', value)
              }}
            />
            <FormError errors={errors} field="is_committee_member" />
          </Grid>
        </Grid>

        <Grid container direction="column" item xs={6}>
          <Grid item>
            <FormControlLabel
              label={messages.input.emailSubscribed}
              control={<Checkbox checked={!!values?.filters?.emailSubscribed} />}
              onChange={(_, value) => {
                setFieldValue('filters.emailSubscribed', value)
              }}
              sx={{ pt: 3 }}
            />
            <FormError errors={errors} field="has_email_subscription" />
          </Grid>
          <Grid item>
            <FormControlLabel
              label={messages.input.SMSSubscribed}
              control={<Checkbox checked={!!values?.filters?.SMSSubscribed} />}
              onChange={(_, value) => {
                setFieldValue('filters.SMSSubscribed', value)
              }}
            />
            <FormError errors={errors} field="has_sms_subscription" />
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

Filters.propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ),
}

export default Filters
