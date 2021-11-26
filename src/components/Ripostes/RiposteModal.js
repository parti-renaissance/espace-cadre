import { useState } from 'react'
import { Dialog, Box, Grid, Button, FormControlLabel, Checkbox } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import TextField from 'ui/TextField'
import AlertBanner from 'ui/AlertBanner'
import { createRiposte, updateRiposte } from 'api/ripostes'
import DomainRiposte from 'domain/riposte'
import { notifyMessages, notifyVariants } from '../shared/notification/constants'
import { useCustomSnackbar } from '../shared/notification/hooks'
import Modal from 'ui/Modal'

const useStyles = makeStyles(theme => ({
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
    background: theme.palette.teal600,
    border: 'none',
    borderRadius: '8.35px',
    '&:hover': {
      backgroundColor: theme.palette.teal700,
    },
  },
}))

const riposteSchema = Yup.object({
  title: Yup.string().min(1, 'Minimum 1 charactère').max(255, 'Maximum 255 charactères').required('Titre obligatoire'),
  body: Yup.string().min(1, 'Minimum 1 charactère').required('Texte obligatoire'),
  url: Yup.string().url('Ce champ doit être une URL valide').required('Url obligatoire'),
})

const messages = {
  createSuccess: 'Riposte créée avec succès',
  editSuccess: 'La riposte a bien été modifiée',
}

const RiposteModal = ({ handleClose, riposte, onSubmitRefresh, open }) => {
  const classes = useStyles()
  const [errorMessage, setErrorMessage] = useState()
  const { enqueueSnackbar } = useCustomSnackbar()

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
    onSubmit: async form => {
      try {
        const newRiposte = riposte
          .withTitle(form.title)
          .withBody(form.body)
          .withUrl(form.url)
          .withWithNotification(form.withNotification)
          .withStatus(form.status)

        !newRiposte.id && (await createRiposte(newRiposte))
        newRiposte.id && (await updateRiposte(newRiposte))

        const confirmMessage = !newRiposte.id ? messages.createSuccess : messages.editSuccess
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
    <Modal open={open} onClose={handleClose}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container justifyContent="space-between" className={classes.innerContainer}>
          <Grid item>
            <Box component="span" className={classes.modalTitle}>
              Créer ou modifier une riposte
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
            <span className={classes.fieldTitle}>Titre</span>{' '}
            <Box component="span" className={classes.charactersLimit}>
              (255 charactères)
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
              (255 charactères)
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField formik={formik} label="body" />
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
            Valider
          </Button>
        </Grid>
      </form>
    </Modal>
  )
}

export default RiposteModal

RiposteModal.defaultProps = {
  handleClose: () => {},
  onSubmitRefresh: () => {},
  riposte: null,
}

RiposteModal.propTypes = {
  handleClose: PropTypes.func,
  onSubmitRefresh: PropTypes.func,
  riposte: DomainRiposte.propTypes,
  open: PropTypes.bool.isRequired,
}
