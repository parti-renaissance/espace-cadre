import PropTypes from 'prop-types'
import { Dialog, Paper, Grid, Button, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import TextField from 'ui/TextField'
import UIFormMessage from 'ui/FormMessage/FormMessage'
import ClearIcon from '@mui/icons-material/Clear'
import Loader from 'ui/Loader'

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(4)};
  width: 664px;
  border-radius: 12px;
`

const ModalTitle = styled(Typography)`
  font-size: 24px;
  color: ${({ theme }) => theme.palette.gray800};
  font-weight: 400;
`

const CharactersLimit = styled(Typography)(
  ({ theme }) => `
  font-size: 10px;
  color: ${theme.palette.gray300}
`
)

const SubmitButton = styled(Button)(({ theme }) => ({
  color: theme.palette.whiteCorner,
  background: theme.palette.cyan600,
  border: 'none',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.cyan700,
  },
  height: '35px',
}))

const messages = {
  create: 'Créer un groupe',
  edit: 'Modifier un groupe',
  addMembers: 'Ajouter des membres',
  add: 'Ajouter',
  groupMember: 'Membres du groupe',
  noMember: 'Ce groupe ne contient aucun membre',
  charactersLimit: '(255 charactères)',
  submit: 'Valider',
}

const groupSchema = Yup.object({
  name: Yup.string().min(1, 'Minimum 1 charactère').max(255, 'Maximum 255 charactères').required('Titre obligatoire'),
})

const GroupModal = ({ open, group, onCloseResolve, createGroup, updateGroup, loader = false, errors }) => {
  const handleClose = () => {
    onCloseResolve()
  }

  const createOrEditGroup = async group => {
    const mutation = group.id ? updateGroup : createGroup
    await mutation(group)
    handleClose()
  }

  const formik = useFormik({
    initialValues: {
      name: group?.name,
    },
    validationSchema: groupSchema,
    enableReinitialize: true,
    onSubmit: values => {
      createOrEditGroup(group.withName(values.name))
    },
  })

  return (
    <Dialog open={open} onClose={handleClose} PaperComponent={StyledPaper}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
          <Grid item>
            <ModalTitle component="span">{group?.id ? messages.edit : messages.create}</ModalTitle>
          </Grid>
          <Grid item>
            <Button type="button" onClick={handleClose}>
              <ClearIcon />
            </Button>
          </Grid>
        </Grid>
        <Grid container sx={{ mb: 2 }}>
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
          <SubmitButton type="submit" fullWidth>
            {loader ? <Loader size={12} color="white" /> : messages.submit}
          </SubmitButton>
        </Grid>
      </form>
    </Dialog>
  )
}

export default GroupModal

GroupModal.defaultProps = {
  group: null,
}

GroupModal.propTypes = {
  open: PropTypes.bool.isRequired,
  group: PropTypes.object,
  onCloseResolve: PropTypes.func.isRequired,
  createGroup: PropTypes.func.isRequired,
  updateGroup: PropTypes.func.isRequired,
  loader: PropTypes.bool,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
}
