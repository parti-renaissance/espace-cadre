import { useState } from 'react'
import { Dialog, Grid, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import { useMutation } from 'react-query'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import ClearIcon from '@mui/icons-material/Clear'
import { createTeamQuery, updateTeamQuery } from '../../api/teams'
import { notifyVariants, notifyMessages } from '../shared/notification/constants'
import { useCustomSnackbar } from '../shared/notification/hooks'
import AlertBanner from 'ui/AlertBanner'
import TextField from 'ui/TextField'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: '32px',
    width: '664px',
    borderRadius: '12px',
  },
  innerContainer: {
    marginBottom: '16px',
  },
  modalTitle: {
    fontSize: '24px',
    color: theme.palette.gray800,
    fontWeight: '400',
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
    margin: '8px 0',
  },
  modalButton: {
    color: theme.palette.whiteCorner,
    background: theme.palette.cyan600,
    border: 'none',
    borderRadius: '8.35px',
    '&:hover': {
      backgroundColor: theme.palette.cyan700,
    },
  },
}))

const messages = {
  addMembers: 'Ajouter des membres',
  add: 'Ajouter',
  teamMember: "Membres de l'équipe",
  noMember: 'Cette équipe ne contient aucun membre',
  createSuccess: 'Equipe créée avec succès',
  editSuccess: "L'équipe a bien été modifiée",
}

const teamSchema = Yup.object({
  name: Yup.string().min(1, 'Minimum 1 charactère').max(255, 'Maximum 255 charactères').required('Titre obligatoire'),
})

const TeamModal = ({ handleClose, teamItem, onSubmitResolve, open }) => {
  const classes = useStyles()
  const [errorMessage, setErrorMessage] = useState()
  const { enqueueSnackbar } = useCustomSnackbar()

  const { mutate: addOrEditTeam } = useMutation(!teamItem?.id ? createTeamQuery : updateTeamQuery, {
    onSuccess: () => {
      const confirmMessage = !teamItem.id ? messages.createSuccess : messages.editSuccess
      enqueueSnackbar(confirmMessage, notifyVariants.success)
      onSubmitResolve()
      handleClose()
    },
    onError: error => {
      setErrorMessage(error)
      enqueueSnackbar(notifyMessages.errorTitle, notifyVariants.error)
    },
  })

  const formik = useFormik({
    initialValues: {
      name: teamItem?.name,
    },
    validationSchema: teamSchema,
    enableReinitialize: true,
    onSubmit: values => {
      addOrEditTeam(!teamItem.id ? { values } : { teamId: teamItem.id, values })
    },
  })

  return (
    <Dialog open={open} onClose={handleClose} classes={{ paper: classes.paper }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container justifyContent="space-between" className={classes.innerContainer}>
          <Grid item>
            <span className={classes.modalTitle}>Créer ou modifier une équipe</span>
          </Grid>
          <Grid item>
            <Button type="button" onClick={handleClose}>
              <ClearIcon />
            </Button>
          </Grid>
        </Grid>
        <Grid container className={classes.innerContainer}>
          <Grid item xs={12}>
            {errorMessage && <AlertBanner severity="error" message={errorMessage} />}
          </Grid>
        </Grid>
        <Grid container className={classes.innerContainer}>
          <Grid item xs={12}>
            <span className={classes.fieldTitle}>Nom</span>{' '}
            <span className={classes.charactersLimit}>(255 charactères)</span>
          </Grid>
          <Grid item xs={12}>
            <TextField formik={formik} label="name" />
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

export default TeamModal

TeamModal.defaultProps = {
  handleClose: () => {},
  onSubmitRefresh: () => {},
  teamItem: null,
}

TeamModal.propTypes = {
  handleClose: PropTypes.func,
  onSubmitResolve: PropTypes.func,
  teamItem: PropTypes.object,
  open: PropTypes.bool.isRequired,
}
