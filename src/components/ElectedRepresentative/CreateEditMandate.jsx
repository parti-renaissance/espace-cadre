import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, FormControlLabel } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { DatePicker } from '@mui/x-date-pickers'
import { createMandate, updateMandate } from 'api/elected-representative'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { FormError } from 'components/shared/error/components'
import ZoneAutocomplete from 'components/Filters/Element/ZoneAutocomplete'
import { zoneTypes } from 'domain/zone'
import { mandates, affiliations, supports } from 'shared/constants'
import { ModalForm } from 'ui/Dialog'
import UIInputLabel from 'ui/InputLabel/InputLabel'
import Input from 'ui/Input/Input'
import Select from 'ui/Select/Select'
import { Checkbox } from 'ui/Checkbox/Checkbox'

const messages = {
  create: 'Créer',
  update: 'Modifier',
  close: 'Fermer',
  creationTitle: "Ajout d'un mandat",
  editionTitle: 'Modification du mandat',
  createSuccess: 'Mandat créé avec succès',
  editSuccess: 'Le mandat a bien été modifié',
}

const fields = {
  type: 'type',
  geoZone: 'geoZone',
  onGoing: 'onGoing',
  beginAt: 'beginAt',
  finishAt: 'finishAt',
  isElected: 'isElected',
  laREMSupport: 'laREMSupport',
  politicalAffiliation: 'politicalAffiliation',
}

const mandateSchema = Yup.object({
  [fields.type]: Yup.string().required('Le type de mandat est obligatoire').default(),
  [fields.beginAt]: Yup.date().required('La date de début est obligatoire'),
  [fields.finishAt]: Yup.date().nullable(),
  [fields.geoZone]: Yup.object().required('La zone géographique est obligatoire'),
  [fields.onGoing]: Yup.boolean().nullable(),
  [fields.politicalAffiliation]: Yup.string().required("L'affiliation politique est obligatoire"),
  [fields.isElected]: Yup.boolean().nullable(),
  [fields.laREMSupport]: Yup.string().nullable(),
}).camelCase()

const CreateEditMandate = ({ electedId, mandate, onUpdateResolve, handleClose }) => {
  const [selectedZone, setSelectedZone] = useState(null)
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages } = useErrorHandler()

  const { control, getValues, watch } = useForm({
    mode: 'onChange',
    defaultValues: mandateSchema.cast(mandate),
    resolver: yupResolver(mandateSchema),
  })

  const watchOnGoing = watch(fields.onGoing, false)

  const { mutate: createOrUpdate, isLoading } = useMutation({
    mutationFn: !mandate.id ? createMandate : updateMandate,
    onSuccess: mandate => {
      onUpdateResolve && onUpdateResolve()
      enqueueSnackbar(mandate ? messages.createSuccess : messages.editSuccess, notifyVariants.success)
      handleClose()
    },
    onError: handleError,
  })

  const createOrEdit = () => {
    const values = {
      ...getValues(),
      electedRepresentative: electedId,
      geoZone: selectedZone?.uuid || mandate.geoZone?.uuid,
    }

    if (!watchOnGoing && values.finishAt === null) {
      enqueueSnackbar('La date de fin pour le mandat est obligatoire', notifyVariants.error)
      return
    }

    createOrUpdate(values)
  }

  useEffect(() => {
    if (mandate && mandate.id) {
      setSelectedZone(mandate.geoZone)
    }
  }, [mandate])

  return (
    <ModalForm
      handleClose={handleClose}
      title={!mandate.id ? messages.creationTitle : messages.editionTitle}
      submitLabel={!mandate.id ? messages.create : messages.update}
      createOrEdit={createOrEdit}
      isLoading={isLoading}
    >
      <Box>
        <UIInputLabel required>Type de mandat</UIInputLabel>
        <Controller
          name={fields.type}
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
        <FormError errors={errorMessages} field={fields.type} />
      </Box>
      <Grid container columnSpacing={4}>
        <Grid item xs={12} sm={6}>
          <Box>
            <Controller
              name={fields.isElected}
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  name={fields.isElected}
                  label="C'est un élu"
                  onChange={onChange}
                  control={<Checkbox checked={value} />}
                />
              )}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <Controller
              name={fields.onGoing}
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  name={fields.onGoing}
                  label="Mandat en cours"
                  onChange={onChange}
                  control={<Checkbox checked={value} />}
                />
              )}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container columnSpacing={4}>
        <Grid item xs={12} sm={6}>
          <Box>
            <UIInputLabel required>Date de début de mandat</UIInputLabel>
            <Controller
              name={fields.beginAt}
              control={control}
              rules={{ required: true }}
              render={({ field: { ref, ...field } }) => <DatePicker slots={{ textField: Input }} {...field} />}
            />
            <FormError errors={errorMessages} field={fields.beginAt} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <UIInputLabel required={!watchOnGoing}>Date de fin de mandat</UIInputLabel>
            <Controller
              name={fields.finishAt}
              control={control}
              rules={{ required: true }}
              render={({ field: { ref, ...field } }) => (
                <DatePicker slots={{ textField: Input }} readOnly={watchOnGoing} disabled={watchOnGoing} {...field} />
              )}
            />
            <FormError errors={errorMessages} field={fields.finishAt} />
          </Box>
        </Grid>
      </Grid>
      <Box>
        <UIInputLabel required>Zone géographique</UIInputLabel>
        <ZoneAutocomplete
          customStyle={{ bgcolor: 'colors.gray.50' }}
          value={selectedZone}
          onChange={setSelectedZone}
          initialParams={{ types: Object.values(zoneTypes).filter(type => type !== zoneTypes.VOTE_PLACE) }}
        />
        <FormError errors={errorMessages} field={fields.geoZone} />
      </Box>
      <Box>
        <UIInputLabel required>Nuance politique</UIInputLabel>
        <Controller
          name={fields.politicalAffiliation}
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Select options={affiliations} onChange={onChange} value={value} />
          )}
        />
        <FormError errors={errorMessages} field={fields.politicalAffiliation} />
      </Box>
      <Box>
        <UIInputLabel>Soutien</UIInputLabel>
        <Controller
          name={fields.laREMSupport}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              options={Object.keys(supports).map(key => ({ key, value: supports[key] }))}
              onChange={onChange}
              value={value ?? ''}
            />
          )}
        />
      </Box>
    </ModalForm>
  )
}

export default CreateEditMandate

CreateEditMandate.propTypes = {
  electedId: PropTypes.string,
  mandate: PropTypes.object,
  onUpdateResolve: PropTypes.func,
  handleClose: PropTypes.func,
}
