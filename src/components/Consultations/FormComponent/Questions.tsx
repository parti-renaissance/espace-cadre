import { Button, FormHelperText, Grid, Stack, TextField, Typography } from '@mui/material'
import { MuiSpacing } from '~/theme/spacing'
import IconButton from '@mui/material/IconButton'
import Iconify from '~/mui/iconify'
import BlockForm from '~/ui/Form/BlockForm'
import { useFormContextCreateDesignation } from '~/components/Consultations/form'
import { useFieldArray } from 'react-hook-form'
import { styled } from '@mui/material/styles'
import QuestionChoices from '~/components/Consultations/FormComponent/QuestionChoices'

export const QuestionTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    background: 'white',
  },
})

const Questions = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContextCreateDesignation()

  const { fields, append, remove } = useFieldArray({ control, name: 'questions' })

  return (
    <BlockForm title="4. Questions">
      <Stack spacing={MuiSpacing.normal}>
        <FormHelperText sx={{ mt: 0 }}>
          Ajoutez jusqu’à 5 questions avec chacune jusqu’à 5 bulletins de réponse. Les réponses libres ne sont pas
          permises. Toutes vos questions seront posées à la suite à vos adhérents et devront toutes obtenir une réponse.
        </FormHelperText>

        {fields.map((field, index) => (
          <Stack
            spacing={MuiSpacing.normal}
            padding={MuiSpacing.normal}
            key={field.id}
            sx={{
              backgroundColor: 'gray100',
              borderRadius: MuiSpacing.normal,
            }}
          >
            <Grid container sx={{ justifyContent: 'space-between' }}>
              <Grid item>
                <Typography variant="h6" gutterBottom={false}>
                  {index + 1}
                  {index + 1 === 1 ? 'ère' : 'ème'} question
                </Typography>
              </Grid>
              {index !== 0 && (
                <Grid item>
                  <IconButton color="error" onClick={() => remove(index)}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Grid>
              )}
            </Grid>
            <QuestionTextField
              label="Titre de la question"
              variant="outlined"
              {...register(`questions.${index}.content`)}
              fullWidth
              error={!!errors.questions?.[index]?.content}
              helperText={
                errors.questions?.[index]?.content ? <>{errors.questions?.[index]?.content?.message}</> : null
              }
            />
            <QuestionChoices questionIndex={index} />
          </Stack>
        ))}

        {!!errors.questions && <FormHelperText error>{errors.questions.message}</FormHelperText>}

        <Button
          variant="outlined"
          startIcon={<Iconify icon="eva:plus-outline" />}
          sx={{ width: 'fit-content' }}
          onClick={event => {
            append({ content: '', choices: [{ label: '' }, { label: '' }] })
            const target = event.target as HTMLElement
            setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 100)
          }}
        >
          Ajouter une question
        </Button>
      </Stack>
    </BlockForm>
  )
}

export default Questions
