import PropTypes from 'prop-types'
import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, FormControlLabel, Typography } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { DatePicker } from '@mui/x-date-pickers'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import ZoneAutocomplete from 'components/Filters/Element/ZoneAutocomplete'
import { mandates } from 'shared/constants'
import { ModalForm } from 'ui/Dialog'
import UIInputLabel from 'ui/InputLabel/InputLabel'
import Input from 'ui/Input/Input'
import Select from 'ui/Select/Select'
import { Checkbox } from 'ui/Checkbox/Checkbox'
import { Mandate } from 'domain/mandate'
import FormError from 'components/shared/error/FormError'
import { createMandate, updateMandate } from 'api/activist'
import { camelCase } from 'lodash/string'

const fields = {
  mandateType: 'mandateType',
  zone: 'zone',
  beginAt: 'beginAt',
  finishAt: 'finishAt',
  delegation: 'delegation',
  onGoing: 'onGoing',
}

const mandateSchema = Yup.object({
  [fields.mandateType]: Yup.string().default('').required('Le type de mandat est obligatoire'),
  [fields.zone]: Yup.object().default(null).nullable(),
  [fields.onGoing]: Yup.boolean(),
  [fields.beginAt]: Yup.date().default(null).nullable(),
  [fields.finishAt]: Yup.date().default(null).nullable(),
  [fields.delegation]: Yup.string().default(''),
}).camelCase()

const MandateModalForm = ({ adherentUuid, mandate, handleClose, ...props }) => {
  const [selectedZone, setSelectedZone] = useState(mandate?.zone)
  const { enqueueSnackbar } = useCustomSnackbar()

  const defaultValues = mandateSchema.cast(
    { ...mandate, onGoing: !mandate.finishAt },
    { stripUnknown: true, assert: false }
  )

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors: formErrors },
    setValue,
    setError,
  } = useForm({
    mode: 'onChange',
    defaultValues: defaultValues,
    resolver: yupResolver(mandateSchema, { abortEarly: false }),
  })

  const watchOnGoing = watch(fields.onGoing)
  const watchType = watch(fields.mandateType)

  const { mutate: createOrUpdate, isLoading } = useMutation({
    mutationFn: !mandate.uuid ? createMandate : updateMandate,
    onSuccess: () => {
      reset()
      enqueueSnackbar('Le mandat a été enregistré', notifyVariants.success)
      handleClose(true)
    },
    onError: ({ response: { data = {} } }) => {
      enqueueSnackbar("Une erreur s'est produite", notifyVariants.error)
      data.violations.map(violation => setError(camelCase(violation.propertyPath), { message: violation.message }))
    },
  })

  return (
    <ModalForm
      handleClose={handleClose}
      title={!mandate.uuid ? "Ajout d'un mandat" : 'Modifier le mandat'}
      submitLabel={!mandate.uuid ? 'Ajouter' : 'Modifier'}
      createOrEdit={handleSubmit(values => {
        const data = {
          adherent: adherentUuid,
          zone: selectedZone?.uuid,
          delegation: values.delegation,
          beginAt: values.beginAt,
          finishAt: values.finishAt,
          mandateType: values.mandateType,
        }

        createOrUpdate({ data, uuid: mandate.uuid })
      })}
      isLoading={isLoading}
      {...props}
    >
      <Box>
        <UIInputLabel required>Type de mandat</UIInputLabel>
        <Controller
          name={fields.mandateType}
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Select
              options={Object.keys(mandates).map(key => ({ key, value: mandates[key] }))}
              onChange={onChange}
              value={value}
            />
          )}
        />
        <FormError message={formErrors[fields.mandateType]?.message} />
      </Box>

      <Box>
        <UIInputLabel required>Zone géographique</UIInputLabel>
        <ZoneAutocomplete
          customStyle={{ mt: 1.5, bgcolor: 'colors.gray.50' }}
          value={selectedZone}
          onChange={setSelectedZone}
          placeholder={'Rechercher...'}
          initialParams={{ forMandateType: watchType, itemsPerType: 20 }}
        />
        <FormError message={formErrors[fields.zone]?.message} />
      </Box>

      <Box>
        <Controller
          name={fields.onGoing}
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <FormControlLabel
              name={fields.onGoing}
              label="Le mandat est en cours"
              onChange={(event, v) => {
                setValue(fields.finishAt, v === true ? null : new Date())
                onChange(event, v)
              }}
              checked={value}
              control={<Checkbox />}
              {...field}
            />
          )}
        />
      </Box>

      <Box>
        <Typography
          component={'p'}
          sx={{
            color: 'colors.gray.500',
            fontStyle: 'italic',
            my: 4,
            pb: 1.5,
            borderBottom: 1.5,
            borderColor: 'colors.gray.300',
          }}
        >
          Optionnel
        </Typography>
      </Box>

      <Grid container columnSpacing={4}>
        <Grid item xs={12} sm={6}>
          <Box>
            <UIInputLabel sx={{ mb: 1.5 }}>Date de début de mandat</UIInputLabel>
            <Controller
              name={fields.beginAt}
              control={control}
              render={({ field: { onChange, ref, ...field } }) => (
                <DatePicker
                  slots={{ textField: Input }}
                  sx={{ mt: 1.5 }}
                  onChange={value => {
                    if (value instanceof Date) {
                      const offset = -value.getTimezoneOffset()
                      value.setHours(Math.trunc(offset / 60), offset % 60)
                    }

                    onChange(value)
                  }}
                  {...field}
                />
              )}
            />
            <FormError message={formErrors[fields.beginAt]?.message} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <UIInputLabel sx={{ mb: 1.5 }}>Date de fin de mandat</UIInputLabel>
            <Controller
              name={fields.finishAt}
              control={control}
              render={({ field: { ref, ...field } }) => (
                <DatePicker slots={{ textField: Input }} disabled={watchOnGoing} readOnly={watchOnGoing} {...field} />
              )}
            />
            <FormError message={formErrors[fields.finishAt]?.message} />
          </Box>
        </Grid>
      </Grid>

      <Box>
        <UIInputLabel sx={{ mb: 1.5 }}>Délégation</UIInputLabel>
        <Controller
          name={fields.delegation}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input name={fields.delegation} onChange={onChange} value={value} />
          )}
        />
        <FormError message={formErrors[fields.delegation]?.message} />
      </Box>
    </ModalForm>
  )
}

export default MandateModalForm

MandateModalForm.propTypes = {
  adherentUuid: PropTypes.string.isRequired,
  mandate: Mandate.propTypes.isRequired,
  handleClose: PropTypes.func.isRequired,
}
