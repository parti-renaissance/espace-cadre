import PropTypes from 'prop-types'
import { Dialog, Grid, Button, Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { styled } from '@mui/system'
import { useFormik } from 'formik'
import * as Yup from 'yup'
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
    marginBottom: '16px',
  },
  modalTitle: {
    fontSize: '24px',
    color: theme.palette.gray800,
    fontWeight: '400',
  },
  textField: {
    border: `1px solid ${theme.palette.gray200}`,
    borderRadius: '8px',
    margin: '8px 0',
  },
  modalButton: {
    color: theme.palette.whiteCorner,
    background: theme.palette.cyan600,
    border: 'none',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: theme.palette.cyan700,
    },
    height: '36px',
  },
}))

const CharactersLimit = styled(Typography)(
  ({ theme }) => `
  font-size: 10px;
  color: ${theme.palette.gray300}
`
)

const messages = {
  create: 'Créer une équipe',
  edit: 'Modifier une équipe',
  addMembers: 'Ajouter des membres',
  add: 'Ajouter',
  teamMember: "Membres de l'équipe",
  noMember: 'Cette équipe ne contient aucun membre',
  charactersLimit: '(255 charactères)',
  submit: 'Valider',
}

const teamSchema = Yup.object({
  name: Yup.string().min(1, 'Minimum 1 charactère').max(255, 'Maximum 255 charactères').required('Titre obligatoire'),
})

const TeamModal = ({ open, team, onCloseResolve, createTeam, updateTeam, loader = false, errors }) => {
  const classes = useStyles()

  const handleClose = () => {
    onCloseResolve()
  }

  const createOrEditTeam = async team => {
    const mutation = team.id ? updateTeam : createTeam
    await mutation(team)
    handleClose()
  }

  const formik = useFormik({
    initialValues: {
      name: team?.name,
    },
    validationSchema: teamSchema,
    enableReinitialize: true,
    onSubmit: values => {
      createOrEditTeam(team.withName(values.name))
    },
  })

  return (
    <Dialog open={open} onClose={handleClose} classes={{ paper: classes.paper }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container justifyContent="space-between" className={classes.innerContainer}>
          <Grid item>
            <Box component="span" className={classes.modalTitle}>
              {team?.id ? messages.edit : messages.create}
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
            <Typography sx={{ fontWeight: 600 }}>Nom</Typography>&nbsp;
            <CharactersLimit>{messages.charactersLimit}</CharactersLimit>
          </Grid>
          <Grid item xs={12}>
            <TextField formik={formik} label="name" />
          </Grid>
          {errors
            .filter(({ field }) => field === 'name')
            .map(({ field, message }) => (
              <Grid item xs={12} key={field}>
                <UIFormMessage severity="error">{message}</UIFormMessage>
              </Grid>
            ))}
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

export default TeamModal

TeamModal.defaultProps = {
  team: null,
}

TeamModal.propTypes = {
  open: PropTypes.bool.isRequired,
  team: PropTypes.object,
  onCloseResolve: PropTypes.func.isRequired,
  createTeam: PropTypes.func.isRequired,
  updateTeam: PropTypes.func.isRequired,
  loader: PropTypes.bool,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
}
