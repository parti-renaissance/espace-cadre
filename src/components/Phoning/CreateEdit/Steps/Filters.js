import PropTypes from 'prop-types'
import { useState } from 'react'
import { useQueryScope } from 'api/useQueryScope'

import DatePicker from '@mui/lab/DatePicker'
import { Autocomplete, FormControlLabel, Grid, InputAdornment, MenuItem, Typography } from '@mui/material'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'

import { useErrorHandler } from 'components/shared/error/hooks'
import { useDebounce } from 'components/shared/debounce'
import { FormError } from 'components/shared/error/components'
import { getPhoningCampaignZones } from 'api/phoning'
import { Checkbox, Input, Label } from '../shared/components'
import { useStepValues } from '../shared/hooks'

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

const initialvalues = {
  filters: {},
  zone: {
    name: '',
  },
}

const Filters = ({ errors = [] }) => {
  const [isZoneFetchable, setIsZoneFetchable] = useState(false)
  const { inputValues, values, updateInputValues, updateValues } = useStepValues(initialvalues)
  const { handleError, errorMessages } = useErrorHandler()
  const debounce = useDebounce()

  const { data: zones = [], isFetching: isZonesFetching } = useQueryScope(
    ['zones', inputValues.zone?.name],
    () => getPhoningCampaignZones(inputValues.zone?.name),
    {
      enabled: isZoneFetchable && !!inputValues.zone?.name,
      onSuccess: () => {
        setIsZoneFetchable(false)
      },
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
            value={inputValues.filters.gender || ''}
            onChange={event => {
              updateInputValues('filters.gender', event.target.value)
              updateValues('filters.gender', event.target.value)
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
            value={inputValues.filters.firstName}
            onChange={event => {
              updateInputValues('filters.firstName', event.target.value)
              debounce(() => updateValues('filters.firstName', event.target.value))
            }}
          />
          <FormError errors={errors} field="first_name" />
        </Grid>
        <Grid item xs={6}>
          <Label sx={{ pt: 3, pb: 1 }}>{messages.input.lastName}</Label>
          <Input
            name="lastName"
            placeholder={messages.placeholder.lastName}
            value={inputValues.filters.lastName}
            onChange={event => {
              updateInputValues('filters.lastName', event.target.value)
              debounce(() => updateValues('filters.lastName', event.target.value))
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
            value={inputValues.filters.ageMin}
            onChange={event => {
              updateInputValues('filters.ageMin', event.target.value)
              debounce(() => updateValues('filters.ageMin', event.target.value))
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
            value={inputValues.filters.ageMax}
            onChange={event => {
              updateInputValues('filters.ageMax', event.target.value)
              debounce(() => updateValues('filters.ageMax', event.target.value))
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
            value={inputValues.filters.adherentFromDate}
            onChange={value => {
              updateInputValues('filters.adherentFromDate', value)
              debounce(() => updateValues('filters.adherentFromDate', value))
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
            value={inputValues.filters.adherentToDate}
            onChange={value => {
              updateInputValues('filters.adherentToDate', value)
              debounce(() => updateValues('filters.adherentToDate', value))
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
          inputValue={inputValues.zone?.name || ''}
          value={values.filters.zones}
          onInputChange={(_, value) => {
            updateInputValues('zone.name', value)
            debounce(() => setIsZoneFetchable(true))
          }}
          onChange={(_, value) => {
            updateValues('filters.zones', value)
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
          limitTags={3}
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
              control={<Checkbox checked={!!values.filters.certified} />}
              onChange={(_, value) => updateValues('filters.certified', value)}
              sx={{ pt: 3 }}
            />
            <FormError errors={errors} field="is_certified" />
          </Grid>
          <Grid item>
            <FormControlLabel
              label={messages.input.committeeMember}
              control={<Checkbox checked={!!values.filters.committeeMember} />}
              onChange={(_, value) => updateValues('filters.committeeMember', value)}
            />
            <FormError errors={errors} field="is_committee_member" />
          </Grid>
        </Grid>

        <Grid container direction="column" item xs={6}>
          <Grid item>
            <FormControlLabel
              label={messages.input.emailSubscribed}
              control={<Checkbox checked={!!values.filters.emailSubscribed} />}
              onChange={(_, value) => updateValues('filters.emailSubscribed', value)}
              sx={{ pt: 3 }}
            />
            <FormError errors={errors} field="has_email_subscription" />
          </Grid>
          <Grid item>
            <FormControlLabel
              label={messages.input.SMSSubscribed}
              control={<Checkbox checked={!!values.filters.SMSSubscribed} />}
              onChange={(_, value) => updateValues('filters.SMSSubscribed', value)}
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
