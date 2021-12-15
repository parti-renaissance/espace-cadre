import { styled } from '@mui/system'
import DatePicker from '@mui/lab/DatePicker'
import {
  Grid,
  Typography,
  Dialog,
  DialogActions,
  Button,
  IconButton,
  TextField,
  InputLabel,
  Paper as MuiPaper,
  InputAdornment,
} from '@mui/material'
import { useFormik } from 'formik'

import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'

const Title = styled(Typography)`
  font-size: 24px;
  font-weight: 400;
  line-height: 24px;
`

const Paper = styled(MuiPaper)(
  ({ theme }) => `
	padding: ${theme.spacing(4)};
	width: 664px;
	border-radius: 12px;
`
)

const StepTitle = styled(Typography)(
  ({ theme }) => `
	font-size: 18px;
	font-weight: 600;
	line-height: 18px;
	color: ${theme.palette.stepper.stepTitle.color};
`
)

const Label = styled(({ children, ...props }) => (
  <InputLabel {...props}>
    <Typography variant="subtitle1">{children}</Typography>
  </InputLabel>
))(
  ({ theme }) => `
	line-height: 16px;
	color: ${theme.palette.form.label.color};
`
)

const Input = styled(props => <TextField size="small" variant="outlined" fullWidth {...props} />)(
  ({ theme, name }) => ({
    '& .MuiOutlinedInput-root': {
      padding: name === 'brief' ? theme.spacing(1.75) : 'inherit',
      paddingLeft: name !== 'brief' ? 0 : theme.spacing(1.75),
      background: theme.palette.form.input.background,
      borderRadius: '8px',
      [`& input[name=${name}]`]: {
        height: '24px',
        padding: name === 'endDate' ? theme.spacing(1.75, 2, 1.25, 0) : theme.spacing(1.5, 2),
        '&::placeholder': {
          letterSpacing: name === 'endDate' ? '-3px' : 'inherit',
        },
      },
      '& fieldset': {
        border: 'none',
      },
      '&.Mui-focused fieldset': {
        border: `2px solid ${theme.palette.form.input.borderColor.focus}`,
      },
      '& .MuiInputAdornment-root': {
        marginRight: 0,
        '& .MuiIconButton-root': {
          padding: theme.spacing(0, 1),
        },
      },
    },
  })
)

const messages = {
  campaignTitle: 'Créer une campagne',
  step: {
    globalSettings: 'Paramètres généraux',
  },
  input: {
    title: 'Titre',
    goal: 'Objectif individuel',
    brief: 'Brief',
    endDate: 'Date de fin',
  },
  placeholder: {
    title: 'Identifiant de la campagne',
    goal: "Nombre de questionnaires à remplir par l'utilisateur",
    endDate: '__  /__  /____',
    brief: 'Rédiger une brève',
  },
}

const CreateModal = () => {
  const formik = useFormik({
    initialValues: {
      title: '',
      goal: '',
      team: '',
      survey: '',
      brief: '',
      endDate: '',
    },
  })

  const { title, goal, endDate, brief } = formik.values
  const isFormValid = !!(title && goal && endDate && brief)

  return (
    <Dialog scroll="body" open={true} onClose={() => {}} PaperComponent={Paper} sx={{ my: '16px' }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Title>{messages.campaignTitle}</Title>
        <IconButton onClick={() => {}}>
          <CloseRoundedIcon />
        </IconButton>
      </Grid>

      <Grid container>
        <StepTitle sx={{ pt: 4 }}>{messages.step.globalSettings}</StepTitle>
      </Grid>

      <Grid container>
        <Label sx={{ pt: 3, pb: 1 }}>{messages.input.title}</Label>
        <Input
          name="title"
          placeholder={messages.placeholder.title}
          value={formik.values.title}
          onChange={formik.handleChange}
        />

        <Label sx={{ pt: 5, pb: 1 }}>{messages.input.goal}</Label>
        <Input
          name="goal"
          placeholder={messages.placeholder.goal}
          value={formik.values.goal}
          onChange={formik.handleChange}
        />

        <Label sx={{ pt: 5, pb: 1 }}>{messages.input.endDate}</Label>
        <DatePicker
          inputFormat="dd/MM/yyyy"
          value={formik.values.endDate}
          onChange={value => {
            formik.setFieldValue('endDate', value)
          }}
          renderInput={props => <Input type="date" name="endDate" {...props} />}
          inputProps={{ placeholder: messages.placeholder.endDate }}
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

        <Label sx={{ pt: 5, pb: 1 }}>{messages.input.brief}</Label>
        <Input
          name="brief"
          placeholder={messages.placeholder.brief}
          minRows={3}
          maxRows={3}
          onChange={formik.handleChange}
          value={formik.values.brief}
          multiline
        />
      </Grid>

      <DialogActions sx={{ p: 0, pt: 6 }}>
        <Button
          onClick={() => {}}
          disabled={isFormValid === false}
          sx={{
            height: '42px',
            bgcolor: isFormValid === true ? 'phoning.color' : 'gray200',
            color: isFormValid === true ? 'phoning.background.main' : 'gray500',
            borderRadius: '8.35px',
            '&:hover': {
              bgcolor: isFormValid === true ? 'phoning.color' : 'gray200',
              color: isFormValid === true ? 'phoning.background.main' : 'gray500',
            },
          }}
          fullWidth
        >
          Suivant
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateModal
