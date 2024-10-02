import { useFormContextCreateDesignation } from '~/components/Consultations/form'
import { useFieldArray } from 'react-hook-form'
import { QuestionTextField } from '~/components/Consultations/FormComponent/Questions'
import Iconify from '~/mui/iconify'
import { Button, FormHelperText, Grid } from '@mui/material'
import IconButton from '@mui/material/IconButton'

const QuestionChoices = ({ questionIndex }: { questionIndex: number }) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContextCreateDesignation()

  const { fields, append, remove } = useFieldArray({ name: `questions.${questionIndex}.choices`, control })

  return (
    <>
      {fields.map((field, index) => (
        <Grid container spacing={2} alignItems={'center'} key={field.id}>
          <Grid item xs>
            <QuestionTextField
              label={`Bulletin ${index + 1}`}
              variant="outlined"
              fullWidth
              {...register(`questions.${questionIndex}.choices.${index}.content`)}
              error={!!errors.questions?.[questionIndex]?.choices?.[index]?.content}
              helperText={errors.questions?.[questionIndex]?.choices?.[index]?.content?.message}
            />
          </Grid>
          {index > 1 && (
            <Grid item>
              <IconButton color="error" onClick={() => remove(index)}>
                <Iconify icon="eva:trash-2-outline" />
              </IconButton>
            </Grid>
          )}
        </Grid>
      ))}

      {!!errors.questions?.[questionIndex]?.choices && (
        <FormHelperText error>{errors.questions?.[questionIndex]?.choices?.message}</FormHelperText>
      )}

      <Button
        variant="outlined"
        startIcon={<Iconify icon="eva:plus-outline" />}
        sx={{ width: 'fit-content' }}
        onClick={() => append({ content: '' })}
      >
        Ajouter un bulletin
      </Button>
    </>
  )
}

export default QuestionChoices
