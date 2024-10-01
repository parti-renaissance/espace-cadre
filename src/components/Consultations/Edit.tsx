import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import PageHeader from '~/ui/PageHeader'
import { featuresLabels } from '~/shared/features'
import { FeatureEnum } from '~/models/feature.enum'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'
import BlockForm from '~/ui/Form/BlockForm'
import { DateTimePicker } from '@mui/x-date-pickers'
import { useState } from 'react'
import { MuiSpacing } from '~/theme/spacing'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Iconify from '~/mui/iconify'

const QuestionTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    background: 'white',
  },
})

type QuestionProps = {
  isAg?: boolean
}

const Edit = ({ isAg }: QuestionProps) => {
  const { isMobile } = useCurrentDeviceType()
  const [questions, setQuestions] = useState([
    {
      title: '',
      options: ['', ''],
    },
  ])

  return (
    <Container maxWidth={false}>
      <Box>
        <Grid container justifyContent="space-between" sx={{ mb: isMobile ? 2 : null }}>
          <PageHeader
            title={featuresLabels[FeatureEnum.CONSULTATIONS]}
            button={
              <Stack alignItems="center" direction="row" spacing={2}>
                <Button variant="contained" color="inherit" size="medium" onClick={() => {}}>
                  Save
                </Button>
              </Stack>
            }
          />
        </Grid>

        <Grid>
          <Stack mt={4} spacing={5}>
            <BlockForm title="1. Création d'une nouvelle consultation">
              <TextField
                label="Titre"
                variant="outlined"
                fullWidth
                // error={!!errors.name}
                // helperText={errors.name?.message}
                // InputLabelProps={{
                //   shrink: !!watch('name'),
                // }}
              />
              <FormControl>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  // error={!!errors.description}
                  // helperText={errors.description?.message}
                  multiline
                  rows={4}
                />
                <FormHelperText>
                  Maximum 1000 caractères. Cette description sera visible dans l’email d’annonce et la page de début du
                  vote.
                </FormHelperText>
              </FormControl>
            </BlockForm>

            <BlockForm title="2. Date, heure">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DateTimePicker label="Du début" sx={{ width: '100%' }} />
                  <FormHelperText>
                    Dans minimum 3 jours pour une durée minimum de 1h et un maximum 7 jours.
                  </FormHelperText>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DateTimePicker label="De fin" sx={{ width: '100%' }} />
                </Grid>
              </Grid>
            </BlockForm>

            <BlockForm title="3. Personnes concernées">
              <FormControl>
                <InputLabel id="participants-label">Participants</InputLabel>
                <Select
                  multiple
                  value={[]}
                  input={<OutlinedInput id="select-multiple-chip" label="Participants" />}
                  labelId={'participants-label'}
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <MenuItem key={year} value={`adherent_${year}`}>
                      Adhérent à jour {year}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Le vote peut être ouvert aux adhérents à jour N ou N-1. Les adhérents non à jour seront notifiés du
                  vote mais devrons cotiser pour y participer. Les sympathisants, eux ne seront pas notifiés.
                </FormHelperText>
              </FormControl>
            </BlockForm>

            <BlockForm title="4. Questions">
              <Stack spacing={MuiSpacing.normal}>
                <FormHelperText sx={{ mt: 0 }}>
                  Ajoutez jusqu’à 5 questions avec chacune jusqu’à 5 bulletins de réponse. Les réponses libres ne sont
                  pas permises. Toutes vos questions seront posées à la suite à vos adhérents et devront toutes obtenir
                  une réponse.
                </FormHelperText>

                {questions.map((question, index) => (
                  <Stack
                    spacing={MuiSpacing.normal}
                    padding={MuiSpacing.normal}
                    key={`question-box-${index}`}
                    sx={{
                      backgroundColor: 'gray100',
                      borderRadius: MuiSpacing.normal,
                    }}
                  >
                    <Grid container sx={{ justifyContent: 'space-between' }}>
                      <Grid item>
                        <Typography variant="h6">
                          {index + 1}
                          {index + 1 === 1 ? 'ère' : 'ème'} question
                        </Typography>
                      </Grid>
                      {index !== 0 && (
                        <Grid item>
                          <IconButton
                            color="error"
                            onClick={() => setQuestions(prevState => prevState.filter((_, i) => i !== index))}
                          >
                            <Iconify icon="eva:trash-2-outline" />
                          </IconButton>
                        </Grid>
                      )}
                    </Grid>
                    <QuestionTextField
                      label="Titre de la question"
                      variant="outlined"
                      value={question.title}
                      fullWidth
                      // error={!!errors.name}
                      // helperText={errors.name?.message}
                      // InputLabelProps={{
                      //   shrink: !!watch('name'),
                      // }}
                    />
                    {question.options.map((option, i) => (
                      <QuestionTextField
                        label={`Bulletin ${i + 1}`}
                        variant="outlined"
                        fullWidth
                        value={option}
                        key={`question-option-${index}-${i}`}
                        // error={!!errors.name}
                        // helperText={errors.name?.message}
                        // InputLabelProps={{
                        //   shrink: !!watch('name'),
                        // }}
                      />
                    ))}
                  </Stack>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="eva:plus-outline" />}
                  sx={{ width: 'fit-content' }}
                  onClick={event => {
                    setQuestions(prevState => prevState.concat([{ title: '', options: ['', ''] }]))
                    const target = event.target as HTMLElement
                    setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 100)
                  }}
                >
                  Ajouter une question
                </Button>
              </Stack>
            </BlockForm>

            <Button
              variant="contained"
              color="primary"
              sx={{
                selfJustify: 'end',
                width: 'fit-content',
                alignSelf: 'end',
              }}
            >
              Suivant
            </Button>
          </Stack>
        </Grid>
      </Box>
    </Container>
  )
}

export default Edit
