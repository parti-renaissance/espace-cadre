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
import { DateTimePicker } from '@mui/x-date-pickers'
import { Controller } from 'react-hook-form'
import { add } from 'date-fns'
import { find } from 'lodash'
import { useFormContextCreateDesignation, useTargetChoices } from '~/components/Consultations/form'
import Questions from '~/components/Consultations/FormComponent/Questions'
import { DesignationType } from '~/domain/designation'

type MainFormProps = {
  onSubmit: (data: DesignationType) => void
  isFullyEditable: boolean
  isEdition: boolean
}

const MainForm = ({ onSubmit, isFullyEditable, isEdition }: MainFormProps) => {
  const targetChoices = useTargetChoices()

  const {
    control,
    watch,
    setError,
    formState: { errors },
    handleSubmit,
  } = useFormContextCreateDesignation()

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
                  multiline
                  rows={4}
                  {...field}
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
                  <Controller
                    control={control}
                    name="voteStartDate"
                    render={({ field }) => (
                      <DateTimePicker
                        value={field.value ?? add(new Date(), { days: 3 })}
                        inputRef={field.ref}
                        onChange={field.onChange}
                        label="Du début"
                        sx={{ width: '100%' }}
                        minDateTime={add(new Date(), { days: 3 })}
                        slotProps={{
                          textField: {
                            helperText: errors.voteStartDate ? <>{errors.voteStartDate?.message}</> : null,
                          },
                        }}
                      />
                    )}
                  />

                  <FormHelperText>
                    Dans minimum 3 jours pour une durée minimum de 1h et un maximum 7 jours.
                  </FormHelperText>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="voteEndDate"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <DateTimePicker
                        value={field.value ?? add(new Date(), { days: 4, hours: 1 })}
                        inputRef={field.ref}
                        onChange={field.onChange}
                        label="De fin"
                        sx={{ width: '100%' }}
                        minDateTime={add(watch('voteStartDate'), { hours: 3 })}
                        disabled={!watch('voteStartDate')}
                        onError={error => setError('voteEndDate', { message: error ?? undefined })}
                        slotProps={{
                          textField: {
                            error: !!errors.voteEndDate,
                            helperText: errors.voteEndDate ? <>{errors.voteEndDate?.message}</> : null,
                          },
                        }}
                      />
                    )}
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
