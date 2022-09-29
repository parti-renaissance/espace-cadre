import PropTypes from 'prop-types'
import { useCallback, useContext, useState } from 'react'
import { useQueryWithScope } from 'api/useQueryWithScope'

import { DatePicker } from '@mui/x-date-pickers'
import { Autocomplete, FormControlLabel, Grid, InputAdornment, MenuItem, Typography } from '@mui/material'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'

import { useCurrentDeviceType } from 'components/shared/device/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useDebounce } from 'components/shared/debounce'
import { FormError } from 'components/shared/error/components'
import { getPhoningCampaignZones } from 'api/phoning'
import { FiltersContext } from './shared/context'
import { Checkbox } from 'ui/Checkbox/Checkbox'
import UIInput from 'ui/Input/Input'
import UIInputLabel from 'ui/InputLabel/InputLabel'
import { fields } from './shared/constants'
import { PickersDay } from 'ui/DateTime/styled'

const DatePickerInputStyles = {
  pt: 1.75,
  pr: 2,
  pb: 1.25,
  pl: 0,
  letterSpacing: '-3px',
}

const messages = {
  input: {
    gender: 'Genre',
    firstName: 'Prénom',
    lastName: 'Nom',
    ageMin: 'Age minimum',
    ageMax: 'Age maximum',
    adherentFromDate: 'Militant depuis le',
    adherentToDate: "Militant jusqu'au",
    certified: 'Certifié',
    committeeMember: "Membre d'un comité",
    emailSubscribed: 'Abonné Email',
    SMSSubscribed: 'Abonné SMS',
    zones: 'Zones',
  },
  placeholder: {
    gender: 'Genre',
    firstName: 'Prénom du militant',
    lastName: 'Nom du militant',
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

const CreateEditFilters = () => {
  const { errors, values, initialValues, updateValues } = useContext(FiltersContext)
  const [inputValues, setInputValues] = useState({ zoneInput: '', ...initialValues })
  const [isZoneFetchable, setIsZoneFetchable] = useState(false)
  const [isAdherentFromDatePickerOpen, setIsAdherentFromDatePickerOpen] = useState(false)
  const [isAdherentToDatePickerOpen, setIsAdherentToDatePickerOpen] = useState(false)
  const { handleError, errorMessages } = useErrorHandler()
  const { isMobile, isDesktop } = useCurrentDeviceType()
  const debounce = useDebounce()

  const updateInputValues = useCallback((key, value) => {
    setInputValues(values => ({ ...values, [key]: value }))
  }, [])

  const { data: zones = [], isFetching: isZonesFetching } = useQueryWithScope(
    ['zones', { feature: 'Phoning', view: 'CreateEditFilters' }, inputValues.zoneInput],
    () => getPhoningCampaignZones(inputValues.zoneInput),
    {
      enabled: isZoneFetchable && !!inputValues.zoneInput,
      onSuccess: () => {
        setIsZoneFetchable(false)
      },
      onError: handleError,
    }
  )

  return (
    <>
      <Grid container direction="row" spacing={2}>
        <Grid item xs={isMobile ? 12 : 6}>
          <UIInputLabel sx={{ pt: 3, pb: 1 }}>{messages.input.gender}</UIInputLabel>
          <UIInput
            name={fields.gender}
            placeholder={messages.placeholder.gender}
            value={inputValues.gender || ''}
            onChange={event => {
              updateInputValues(fields.gender, event.target.value)
              updateValues(fields.gender, event.target.value)
            }}
            select
          >
            {messages.options.gender.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </UIInput>
          <FormError errors={errors} field="gender" />
        </Grid>
      </Grid>

      <Grid container direction="row" spacing={2}>
        <Grid item xs={isMobile ? 12 : 6}>
          <UIInputLabel sx={{ pt: 3, pb: 1 }}>{messages.input.firstName}</UIInputLabel>
          <UIInput
            name={fields.firstName}
            placeholder={messages.placeholder.firstName}
            value={inputValues.firstName}
            onChange={event => {
              updateInputValues(fields.firstName, event.target.value)
              debounce(() => updateValues(fields.firstName, event.target.value))
            }}
          />
          <FormError errors={errors} field="first_name" />
        </Grid>
        <Grid item xs={isMobile ? 12 : 6}>
          <UIInputLabel sx={{ pt: 3, pb: 1 }}>{messages.input.lastName}</UIInputLabel>
          <UIInput
            name={fields.lastName}
            placeholder={messages.placeholder.lastName}
            value={inputValues.lastName}
            onChange={event => {
              updateInputValues(fields.lastName, event.target.value)
              debounce(() => updateValues(fields.lastName, event.target.value))
            }}
          />
          <FormError errors={errors} field="last_name" />
        </Grid>
      </Grid>

      <Grid container direction="row" spacing={2}>
        <Grid item xs={isMobile ? 12 : 6}>
          <UIInputLabel sx={{ pt: 3, pb: 1 }}>{messages.input.ageMin}</UIInputLabel>
          <UIInput
            type="number"
            name={fields.ageMin}
            placeholder={messages.placeholder.ageMin}
            value={inputValues.ageMin}
            onChange={event => {
              updateInputValues(fields.ageMin, event.target.value)
              debounce(() => updateValues(fields.ageMin, event.target.value))
            }}
          />
          <FormError errors={errors} field="age_min" />
        </Grid>
        <Grid item xs={isMobile ? 12 : 6}>
          <UIInputLabel sx={{ pt: 3, pb: 1 }}>{messages.input.ageMax}</UIInputLabel>
          <UIInput
            type="number"
            name={fields.ageMax}
            placeholder={messages.placeholder.ageMax}
            value={inputValues.ageMax}
            onChange={event => {
              updateInputValues(fields.ageMax, event.target.value)
              debounce(() => updateValues(fields.ageMax, event.target.value))
            }}
          />
          <FormError errors={errors} field="age_max" />
        </Grid>
      </Grid>

      <Grid container direction="row" spacing={2}>
        <Grid item xs={isMobile ? 12 : 6}>
          <UIInputLabel sx={{ pt: 3, pb: 1 }}>{messages.input.adherentFromDate}</UIInputLabel>
          <DatePicker
            inputFormat="dd/MM/yyyy"
            open={isAdherentFromDatePickerOpen}
            value={inputValues.adherentFromDate}
            onChange={value => {
              updateInputValues(fields.adherentFromDate, value)
              debounce(() => updateValues(fields.adherentFromDate, value))
            }}
            renderDay={(_, __, props) => <PickersDay {...props} />}
            renderInput={props => (
              <UIInput type="date" name={fields.adherentFromDate} {...props} sx={DatePickerInputStyles} />
            )}
            inputProps={{ placeholder: messages.placeholder.adherentFromDate, autoComplete: 'off' }}
            InputProps={{
              onClick: () => {
                setIsAdherentFromDatePickerOpen(true)
              },
            }}
            onClose={() => {
              setIsAdherentFromDatePickerOpen(false)
            }}
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
        <Grid item xs={isMobile ? 12 : 6}>
          <UIInputLabel sx={{ pt: 3, pb: 1 }}>{messages.input.adherentToDate}</UIInputLabel>
          <DatePicker
            inputFormat="dd/MM/yyyy"
            open={isAdherentToDatePickerOpen}
            value={inputValues.adherentToDate}
            onChange={value => {
              updateInputValues(fields.adherentToDate, value)
              debounce(() => updateValues(fields.adherentToDate, value))
            }}
            renderDay={(_, __, props) => <PickersDay {...props} />}
            renderInput={props => (
              <UIInput type="date" name={fields.adherentToDate} {...props} sx={DatePickerInputStyles} />
            )}
            inputProps={{ placeholder: messages.placeholder.adherentToDate, autoComplete: 'off' }}
            InputProps={{
              onClick: () => {
                setIsAdherentToDatePickerOpen(true)
              },
            }}
            onClose={() => {
              setIsAdherentToDatePickerOpen(false)
            }}
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

      <Grid item xs={12}>
        <UIInputLabel sx={{ pt: 3, pb: 1 }}>{messages.input.zones}</UIInputLabel>
        <Autocomplete
          options={zones}
          inputValue={inputValues.zoneInput}
          value={values.zones}
          onInputChange={(_, value) => {
            updateInputValues('zoneInput', value)
            debounce(() => setIsZoneFetchable(true))
          }}
          onChange={(_, value) => {
            updateValues(fields.zones, value)
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={option => option.name ?? ''}
          renderOption={(props, option, { selected }) => (
            <MenuItem {...props} key={option.id}>
              <Checkbox checked={selected} />
              <Typography>
                {option.name} ({option.code})
              </Typography>
            </MenuItem>
          )}
          renderInput={params => <UIInput name={fields.zones} placeholder={messages.placeholder.zones} {...params} />}
          loading={isZonesFetching}
          loadingText={messages.pleaseWait}
          noOptionsText={inputValues.zoneInput && messages.noResult}
          limitTags={3}
          multiple
          autoComplete
          fullWidth
        />
        <FormError errors={errorMessages} field="zones" />
      </Grid>

      {isDesktop && (
        <Grid container direction="row" spacing={2}>
          <Grid container direction="column" item xs={6}>
            <Grid item>
              <FormControlLabel
                name={fields.certified}
                label={messages.input.certified}
                control={<Checkbox checked={!!values.certified} />}
                onChange={(_, value) => updateValues(fields.certified, value)}
                sx={{ pt: 3 }}
              />
              <FormError errors={errors} field="is_certified" />
            </Grid>
            <Grid item>
              <FormControlLabel
                name={fields.committeeMember}
                label={messages.input.committeeMember}
                control={<Checkbox checked={!!values.committeeMember} />}
                onChange={(_, value) => updateValues(fields.committeeMember, value)}
              />
              <FormError errors={errors} field="is_committee_member" />
            </Grid>
          </Grid>

          <Grid container direction="column" item xs={6}>
            <Grid item>
              <FormControlLabel
                name={fields.emailSubscribed}
                label={messages.input.emailSubscribed}
                control={<Checkbox checked={!!values.emailSubscribed} />}
                onChange={(_, value) => updateValues(fields.emailSubscribed, value)}
                sx={{ pt: 3 }}
              />
              <FormError errors={errors} field="has_email_subscription" />
            </Grid>
            <Grid item>
              <FormControlLabel
                name={fields.SMSSubscribed}
                label={messages.input.SMSSubscribed}
                control={<Checkbox checked />}
                onChange={(_, value) => updateValues(fields.SMSSubscribed, value)}
                disabled
              />
              <FormError errors={errors} field="has_sms_subscription" />
            </Grid>
          </Grid>
        </Grid>
      )}
      {isMobile && (
        <>
          <Grid container direction="column" item xs={12}>
            <Grid item>
              <FormControlLabel
                name={fields.certified}
                label={messages.input.certified}
                control={<Checkbox checked={!!values.certified} />}
                onChange={(_, value) => updateValues(fields.certified, value)}
                sx={{ pt: 3 }}
              />
              <FormError errors={errors} field="is_certified" />
            </Grid>
          </Grid>

          <Grid container direction="column" item xs={12}>
            <Grid item>
              <FormControlLabel
                name={fields.committeeMember}
                label={messages.input.committeeMember}
                control={<Checkbox checked={!!values.committeeMember} />}
                onChange={(_, value) => updateValues(fields.committeeMember, value)}
              />
              <FormError errors={errors} field="is_committee_member" />
            </Grid>
          </Grid>

          <Grid container direction="column" item xs={12}>
            <Grid item>
              <FormControlLabel
                name={fields.emailSubscribed}
                label={messages.input.emailSubscribed}
                control={<Checkbox checked={!!values.emailSubscribed} />}
                onChange={(_, value) => updateValues(fields.emailSubscribed, value)}
              />
              <FormError errors={errors} field="has_email_subscription" />
            </Grid>
          </Grid>

          <Grid container direction="column" item xs={12}>
            <Grid item>
              <FormControlLabel
                name={fields.SMSSubscribed}
                label={messages.input.SMSSubscribed}
                control={<Checkbox checked />}
                onChange={(_, value) => updateValues(fields.SMSSubscribed, value)}
                disabled
              />
              <FormError errors={errors} field="has_sms_subscription" />
            </Grid>
          </Grid>
        </>
      )}
    </>
  )
}

CreateEditFilters.propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ),
}

export default CreateEditFilters
