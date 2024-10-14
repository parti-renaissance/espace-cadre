import {
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
import { useFormContextCreateDesignation, useTargetChoices } from '~/components/Consultations/form'
import Questions from '~/components/Consultations/FormComponent/Questions'
import { DesignationType } from '~/domain/designation'
import DateTimePicker from '~/components/Consultations/FormComponent/DateTimePicker'
import { useEffect } from 'react'

type MainFormProps = {
  onSubmit: (data: DesignationType) => void
  isFullyEditable: boolean
  isEdition: boolean
  apiErrors: { field: string; message: string }[]
}

const MainForm = ({ apiErrors, onSubmit, isFullyEditable, isEdition }: MainFormProps) => {
  const targetChoices = useTargetChoices()

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
      setError(fieldName as keyof DesignationType, { message })
    })
  }, [apiErrors, setError])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack mt={4} spacing={5}>
        <BlockForm title={isEdition ? '' : "1. Création d'une nouvelle consultation"}>
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
                  rows={4}
                  error={!!errors.description}
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

        {isFullyEditable && (
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
              <FormControl error={!!errors.target}>
                <InputLabel id="participants-label">Participants</InputLabel>
                <Controller
                  control={control}
                  name="target"
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      {...field}
                      ref={register(field.name).ref}
                      multiple
                      input={<OutlinedInput id="select-multiple-chip" label="Participants" />}
                      labelId={'participants-label'}
                      renderValue={selected => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map(value => (
                            <Chip key={value} label={find(targetChoices, { value })?.label} />
                          ))}
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
                  {errors.target ? (
                    <>{errors.target?.message}</>
                  ) : (
                    <>
                      Le vote peut être ouvert aux adhérents à jour N ou N-1. Les adhérents non à jour seront notifiés
                      du vote mais devrons cotiser pour y participer. Les sympathisants, eux ne seront pas notifiés.
                    </>
                  )}
                </FormHelperText>
              </FormControl>
            </BlockForm>

            <Questions />
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
