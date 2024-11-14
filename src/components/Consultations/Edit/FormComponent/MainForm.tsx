import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import BlockForm from '~/ui/Form/BlockForm'
import { Controller } from 'react-hook-form'
import { find } from 'lodash'
import { useFormContextCreateDesignation, useTargetYearChoices } from '~/components/Consultations/Edit/form'
import Questions from '~/components/Consultations/Edit/FormComponent/Questions'
import { Designation, DesignationType } from '~/domain/designation'
import DateTimePicker from '~/components/Consultations/Edit/FormComponent/DateTimePicker'
import { useEffect } from 'react'
import { messages } from '~/components/Consultations/messages'

type MainFormProps = {
  onSubmit: (data: DesignationType) => void
  designation: Designation
  apiErrors: { field: string; message: string }[]
}

const MainForm = ({ apiErrors, onSubmit, designation }: MainFormProps) => {
  const targetChoices = useTargetYearChoices()

  const {
    control,
    watch,
    setError,
    formState: { errors },
    handleSubmit,
    register,
  } = useFormContextCreateDesignation()

  useEffect(() => {
    apiErrors.forEach(({ field, message }) => {
      let fieldName = field
      if (field.startsWith('poll.')) {
        fieldName = field.replace('poll.', '')
      }

      if (fieldName in ({} as DesignationType)) {
        setError(fieldName as keyof DesignationType, { message })
      }
    })
  }, [apiErrors, setError])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack mt={4} spacing={5}>
        {!designation.isFullyEditable && (
          <Alert severity="info">
            Vous ne pouvez plus modifier les paramètres {designation.isVote() ? 'du vote' : 'de la consultation'} car
            vos adhérents ont déjà été notifiés.
          </Alert>
        )}
        <BlockForm title={designation.id ? '' : messages[designation.type].step1}>
          <Controller
            control={control}
            name="customTitle"
            render={({ field }) => (
              <TextField
                label="Titre"
                variant="outlined"
                {...field}
                ref={register(field.name).ref}
                error={!!errors.customTitle}
                helperText={errors.customTitle ? <>{errors.customTitle?.message}</> : null}
              />
            )}
          />

          <FormControl>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <TextField
                  label="Description"
                  variant="outlined"
                  {...field}
                  ref={register(field.name).ref}
                  multiline
                  minRows={4}
                  error={!!errors.description}
                  inputProps={{ style: { resize: 'vertical' } }}
                  helperText={errors.description ? <>{errors.description?.message}</> : null}
                />
              )}
            />
            <FormHelperText>
              Maximum 1000 caractères. Cette description sera visible dans l’email d’annonce et la page de début du
              vote.
            </FormHelperText>
          </FormControl>
        </BlockForm>

        {designation.isFullyEditable && (
          <>
            <BlockForm title="2. Date, heure">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    register={register}
                    setError={setError}
                    control={control}
                    name="voteStartDate"
                    label="Du début"
                  />
                  <FormHelperText>
                    Dans minimum 3 jours pour une durée minimum de 1h et un maximum 7 jours.
                  </FormHelperText>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    setError={setError}
                    register={register}
                    control={control}
                    name="voteEndDate"
                    label="De fin"
                    disabled={!watch('voteStartDate')}
                  />
                </Grid>
              </Grid>
            </BlockForm>

            <BlockForm title="3. Personnes concernées">
              <FormControl error={!!errors.targetYear}>
                <InputLabel id="participants-label">Participants</InputLabel>
                <Controller
                  control={control}
                  name="targetYear"
                  render={({ field }) => (
                    <Select
                      {...field}
                      ref={register(field.name).ref}
                      input={<OutlinedInput id="select-multiple-chip" label="Participants" />}
                      labelId={'participants-label'}
                      disabled={designation.isVote()}
                      renderValue={selected => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          <Chip key={selected} label={find(targetChoices, { value: selected })?.label} />
                        </Box>
                      )}
                    >
                      {targetChoices.map(choice => (
                        <MenuItem key={choice.value} value={choice.value}>
                          {choice.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>
                  {errors.targetYear ? (
                    <>{errors.targetYear?.message}</>
                  ) : (
                    <>
                      Le vote peut être ouvert aux adhérents à jour N ou N-1. Les adhérents non à jour seront notifiés
                      du vote mais devrons cotiser pour y participer. Les sympathisants, eux ne seront pas notifiés.
                    </>
                  )}
                </FormHelperText>
              </FormControl>
            </BlockForm>

            <Questions designation={designation} />
          </>
        )}

        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            selfJustify: 'end',
            width: 'fit-content',
            alignSelf: 'end',
          }}
        >
          Suivant
        </Button>
      </Stack>
    </form>
  )
}

export default MainForm
