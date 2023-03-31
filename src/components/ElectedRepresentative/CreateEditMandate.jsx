import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, FormControlLabel } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { createMandate, updateMandate } from 'api/elected-representative'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { FormError } from 'components/shared/error/components'
import ZoneAutocomplete from 'components/Filters/Element/ZoneAutocomplete'
import { mandats, affiliations, supports } from 'shared/constants'
import { ModalForm } from 'ui/Dialog'
import UIInputLabel from 'ui/InputLabel/InputLabel'
import Select from 'ui/Select/Select'
import Input from 'ui/Input/Input'
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
  geoZone: 'geo_zone',
  onGoing: 'on_going',
  beginAt: 'begin_at',
  finishAt: 'finish_at',
  isElected: 'is_elected',
  laREMSupport: 'la_r_e_m_support',
  politicalAffiliation: 'political_affiliation',
}

const mandateSchema = Yup.object({
  type: Yup.string().required('Le type de mandat est obligatoire'),
  beginAt: Yup.date().required('La date de début est obligatoire'),
  finishAt: Yup.date().optional(),
  geoZone: Yup.string().required('La zone géographique est obligatoire'),
  onGoing: Yup.boolean().optional(),
  politicalAffiliation: Yup.string().required("L'affiliation politique est obligatoire"),
})

const CreateEditMandate = ({ electedId, mandate, onUpdateResolve, handleClose }) => {
  const [selectedZone, setSelectedZone] = useState(null)
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages } = useErrorHandler()
  const { control, getValues, reset, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(mandateSchema),
  })

  watch()
  const watchOnGoing = watch(fields.onGoing, false)
  const values = getValues()

  const { mutate: createOrUpdate, isLoading } = useMutation(!mandate ? createMandate : updateMandate, {
    onSuccess: mandate => {
      onUpdateResolve && onUpdateResolve()
      enqueueSnackbar(mandate ? messages.createSuccess : messages.editSuccess, notifyVariants.success)
      handleClose()
    },
    onError: handleError,
  })

  const createOrEdit = () => {
    const { finish_at } = values
    if (!watchOnGoing && (finish_at === '' || finish_at === null)) {
      enqueueSnackbar('La date de fin pour le mandat est obligatoire', notifyVariants.error)
      return
    }

    createOrUpdate({
      ...values,
      elected_representative: electedId,
      la_r_e_m_support: values.la_r_e_m_support || null,
      geo_zone: selectedZone?.uuid || mandate?.geo_zone?.uuid,
    })
  }

  useEffect(() => {
    if (mandate && mandate.uuid) {
      setSelectedZone(mandate.geo_zone)
      reset(mandate)
    }
  }, [mandate, reset])

  return (
    <ModalForm
      handleClose={handleClose}
      title={!mandate ? messages.creationTitle : messages.editionTitle}
      submitLabel={!mandate ? messages.create : messages.update}
      createOrEdit={createOrEdit}
      isLoading={isLoading}
    >
      <Box>
        <UIInputLabel required>Type de mandat</UIInputLabel>
        <Controller
          name={fields.type}
          control={control}
          defaultValue={mandate?.type || ''}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Select
              options={Object.keys(mandats).map(key => ({ key, value: mandats[key] }))}
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
              defaultValue={mandate?.is_elected || false}
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
              defaultValue={mandate?.on_going || false}
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
              defaultValue={mandate?.begin_at || ''}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  value={value}
                  onChange={onChange}
                  renderInput={params => <Input type="date" name={fields.beginAt} {...params} />}
                />
              )}
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
              defaultValue={mandate?.finish_at || ''}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  value={value}
                  onChange={onChange}
                  readOnly={watchOnGoing ?? false}
                  disabled={watchOnGoing ?? false}
                  renderInput={params => <Input type="date" name={fields.finishAt} {...params} />}
                />
              )}
            />
            <FormError errors={errorMessages} field={fields.finishAt} />
          </Box>
        </Grid>
      </Grid>
      <Box>
        <UIInputLabel required>Zone géographique</UIInputLabel>
        <ZoneAutocomplete
          customStyle={{ bgcolor: theme => theme.palette.colors.gray[50] }}
          value={selectedZone}
          onChange={setSelectedZone}
        />
        <FormError errors={errorMessages} field={fields.geoZone} />
      </Box>
      <Box>
        <UIInputLabel required>Nuance politique</UIInputLabel>
        <Controller
          name={fields.politicalAffiliation}
          control={control}
          defaultValue={mandate?.political_affiliation || ''}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Select
              options={Object.keys(affiliations).map(key => ({ key, value: affiliations[key] }))}
              onChange={onChange}
              value={value}
            />
          )}
        />
        <FormError errors={errorMessages} field={fields.politicalAffiliation} />
      </Box>
      <Box>
        <UIInputLabel>Soutien</UIInputLabel>
        <Controller
          name={fields.laREMSupport}
          control={control}
          defaultValue={mandate?.la_r_e_m_support || ''}
          render={({ field: { onChange, value } }) => (
            <Select
              options={Object.keys(supports).map(key => ({ key, value: supports[key] }))}
              onChange={onChange}
              value={value}
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
