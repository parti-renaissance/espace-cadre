import { useState } from 'react'
import { Dialog, Box, Grid, Button, FormControlLabel, Checkbox } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import TextField from 'ui/TextField'
import AlertBanner from 'ui/AlertBanner'
import { createNews, updateNews } from 'api/news'
import DomainNews from 'domain/news'
import { notifyMessages, notifyVariants } from '../shared/notification/constants'
import { useCustomSnackbar } from '../shared/notification/hooks'

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
  cross: {
    color: theme.palette.gray700,
    marginTop: theme.spacing(2.75),
    cursor: 'pointer',
  },
  charactersLimit: {
    fontSize: '10px',
    color: theme.palette.gray300,
  },
  fieldTitle: {
    fontWeight: '600',
  },
  textField: {
    border: `1px solid ${theme.palette.gray200}`,
    borderRadius: '8.35px',
    margin: theme.spacing(1, 0),
  },
  modalButton: {
    color: theme.palette.whiteCorner,
    background: theme.palette.orange500,
    border: 'none',
    borderRadius: '8.35px',
    '&:hover': {
      backgroundColor: theme.palette.orange600,
    },
  },
}))

const newsSchema = Yup.object({
  title: Yup.string().min(1, 'Minimum 1 charactère').max(120, 'Maximum 120 charactères').required('Titre obligatoire'),
  body: Yup.string().min(1, 'Minimum 1 charactère').max(1000, 'Maximum 1000 charactères').required('Texte obligatoire'),
  url: Yup.string().url('Ce champ doit être une URL valide').required('Url obligatoire'),
})

const messages = {
  title: 'Titre',
  createNews: 'Nouvelle actualité',
  editNews: "Modifier l'actualité",
  createSuccess: 'Actualité créée avec succès',
  editSuccess: "L'actualité a bien été modifiée",
}

const NewsModal = ({ handleClose, news, onSubmitRefresh, open }) => {
  const classes = useStyles()
  const [errorMessage, setErrorMessage] = useState()
  const { enqueueSnackbar } = useCustomSnackbar()

  const formik = useFormik({
    initialValues: {
      title: news?.title,
      body: news?.body,
      url: news?.url,
      withNotification: news?.withNotification,
    },
    validationSchema: newsSchema,
    enableReinitialize: true,
    onSubmit: async form => {
      try {
        const newNews = news
          .withTitle(form.title)
          .withBody(form.body)
          .withUrl(form.url)
          .withWithNotification(form.withNotification)

        !newNews.id && (await createNews(newNews))
        newNews.id && (await updateNews(newNews))

        const confirmMessage = !newNews.id ? messages.createSuccess : messages.editSuccess
        enqueueSnackbar(confirmMessage, notifyVariants.success)
        onSubmitRefresh()
        handleClose()
      } catch (error) {
        setErrorMessage(error)
        enqueueSnackbar(notifyMessages.errorTitle, notifyVariants.error)
      }
    },
  })

  return (
    <Dialog open={open} onClose={handleClose} classes={{ paper: classes.paper }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container justifyContent="space-between" className={classes.innerContainer}>
          <Grid item>
            <Box component="span" className={classes.modalTitle}>
              {news?.id ? messages.editNews : messages.createNews}
            </Box>
          </Grid>
          <Grid item>
            <Box component="span" className={classes.cross} onClick={handleClose}>
              X
            </Box>
          </Grid>
        </Grid>
        <Grid container className={classes.innerContainer}>
          <Grid item xs={12}>
            {errorMessage && <AlertBanner severity="error" message={errorMessage} />}
          </Grid>
        </Grid>
        <Grid container className={classes.innerContainer}>
          <Grid item xs={12}>
            <span className={classes.fieldTitle}>{messages.title}</span>{' '}
            <Box component="span" className={classes.charactersLimit}>
              (120 charactères)
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField formik={formik} label="title" />
          </Grid>
        </Grid>
        <Grid container className={classes.innerContainer}>
          <Grid item xs={12}>
            <span className={classes.fieldTitle}>Texte</span>{' '}
            <Box component="span" className={classes.charactersLimit}>
              (1000 charactères)
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField formik={formik} label="body" isLong />
          </Grid>
        </Grid>
        <Grid container className={classes.innerContainer}>
          <Grid item xs={12}>
            <span className={classes.fieldTitle}>URL</span>{' '}
            <Box component="span" className={classes.charactersLimit}>
              (255 charactères)
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField formik={formik} label="url" />
          </Grid>
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
        </Grid>
        <Grid container>
          <Button type="submit" className={classes.modalButton} fullWidth>
            Valider
          </Button>
        </Grid>
      </form>
    </Dialog>
  )
}

export default NewsModal

NewsModal.defaultProps = {
  handleClose: () => {},
  onSubmitRefresh: () => {},
  news: null,
}

NewsModal.propTypes = {
  handleClose: PropTypes.func,
  onSubmitRefresh: PropTypes.func,
  news: DomainNews.propTypes,
  open: PropTypes.bool.isRequired,
}
