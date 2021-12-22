import { Box, Button, Checkbox, Dialog, FormControlLabel, Grid, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import DomainRiposte from 'domain/riposte'
import TextField from 'ui/TextField'
import UIFormMessage from 'ui/FormMessage/FormMessage'
import ClearIcon from '@mui/icons-material/Clear'
import Loader from 'ui/Loader'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(4),
    width: '664px',
    borderRadius: '12px',
  },
  innerContainer: {
    marginBottom: theme.spacing(2),
  },
  modalTitle: {
    fontSize: '24px',
    color: theme.palette.gray800,
    fontWeight: '400',
  },
  textField: {
    border: `1px solid ${theme.palette.gray200}`,
    borderRadius: '8px',
    margin: theme.spacing(1, 0),
  },
  modalButton: {
    color: theme.palette.whiteCorner,
    background: theme.palette.teal600,
    border: 'none',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: theme.palette.teal700,
    },
    height: '35px',
  },
}))

const CharactersLimit = styled(Typography)(
  ({ theme }) => `
  font-size: 10px;
  color: ${theme.palette.gray300}
`
)

const messages = {
  create: 'Créer une riposte',
  edit: 'Modifier une riposte',
  charactersLimit: '(255 caractères)',
  title: 'Titre',
  text: 'Texte',
  url: 'URL',
  submit: 'Valider',
}

const riposteSchema = Yup.object({
  title: Yup.string().min(1, 'Minimum 1 charactère').max(255, 'Maximum 255 charactères').required('Titre obligatoire'),
  body: Yup.string().min(1, 'Minimum 1 charactère').required('Texte obligatoire'),
  url: Yup.string().url('Ce champ doit être une URL valide').required('Url obligatoire'),
})

const CreateEditModal = ({ open, riposte, onCloseResolve, createRiposte, updateRiposte, loader = false, errors }) => {
  const classes = useStyles()

  const handleClose = () => {
    onCloseResolve()
  }

  const createOrEditRiposte = async riposte => {
    const mutation = riposte.id ? updateRiposte : createRiposte
    await mutation(riposte)
    handleClose()
  }

  const formik = useFormik({
    initialValues: {
      title: riposte?.title,
      body: riposte?.body,
      url: riposte?.url,
      withNotification: riposte?.withNotification,
      status: riposte?.status,
    },
    validationSchema: riposteSchema,
    enableReinitialize: true,
    onSubmit: values => {
      createOrEditRiposte(
        riposte
          .withTitle(values.title)
          .withBody(values.body)
          .withUrl(values.url)
          .withWithNotification(values.withNotification)
          .withStatus(values.status)
      )
    },
  })

  return (
    <Dialog open={open} onClose={handleClose} classes={{ paper: classes.paper }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container justifyContent="space-between" className={classes.innerContainer}>
          <Grid item>
            <Box component="span" className={classes.modalTitle}>
              {!riposte?.id ? messages.create : messages.edit}
            </Box>
          </Grid>
          <Grid item>
            <Button type="button" onClick={handleClose}>
              <ClearIcon />
            </Button>
          </Grid>
        </Grid>
        <Grid container className={classes.innerContainer}>
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: 600 }}>{messages.title}</Typography>&nbsp;
            <CharactersLimit>{messages.charactersLimit}</CharactersLimit>
          </Grid>
          <Grid item xs={12}>
            <TextField formik={formik} label="title" />
          </Grid>
          {errors
            .filter(({ field }) => field === 'title')
            .map(({ field, message }) => (
              <Grid item xs={12} key={field}>
                <UIFormMessage severity="error">{message}</UIFormMessage>
              </Grid>
            ))}
        </Grid>
        <Grid container className={classes.innerContainer}>
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: 600 }}>{messages.text}</Typography>&nbsp;
            <CharactersLimit>{messages.charactersLimit}</CharactersLimit>
          </Grid>
          <Grid item xs={12}>
            <TextField formik={formik} label="body" />
          </Grid>
          {errors
            .filter(({ field }) => field === 'body')
            .map(({ field, message }) => (
              <Grid item xs={12} key={field}>
                <UIFormMessage severity="error">{message}</UIFormMessage>
              </Grid>
            ))}
        </Grid>
        <Grid container className={classes.innerContainer}>
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: 600 }}>{messages.url}</Typography>&nbsp;
            <CharactersLimit>{messages.charactersLimit}</CharactersLimit>
          </Grid>
          <Grid item xs={12}>
            <TextField formik={formik} label="url" />
          </Grid>
          {errors
            .filter(({ field }) => field === 'source_url')
            .map(({ field, message }) => (
              <Grid item xs={12} key={field}>
                <UIFormMessage severity="error">{message}</UIFormMessage>
              </Grid>
            ))}
        </Grid>
        <Grid container className={classes.innerContainer}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  id="withNotification"
                  size="small"
                  color="primary"
                  checked={formik.values.withNotification}
                  onChange={formik.handleChange}
                />
              }
              label="Avec notification"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  id="status"
                  color="primary"
                  size="small"
                  checked={formik.values.status}
                  onChange={formik.handleChange}
                />
              }
              label="Active"
            />
          </Grid>
        </Grid>
        <Grid container>
          <Button type="submit" className={classes.modalButton} fullWidth>
            {loader ? <Loader size={12} color="white" /> : messages.submit}
          </Button>
        </Grid>
      </form>
    </Dialog>
  )
}

export default CreateEditModal

CreateEditModal.defaultProps = {
  riposte: null,
}

CreateEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  riposte: DomainRiposte.propTypes,
  onCloseResolve: PropTypes.func.isRequired,
  createRiposte: PropTypes.func.isRequired,
  updateRiposte: PropTypes.func.isRequired,
  loader: PropTypes.bool,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
}
