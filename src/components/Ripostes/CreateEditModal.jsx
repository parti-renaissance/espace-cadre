import { Button, FormControlLabel, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import DomainRiposte from '~/domain/riposte'
import TextField from '~/ui/TextField'
import UIFormMessage from '~/ui/FormMessage/FormMessage'
import ClearIcon from '@mui/icons-material/Clear'
import Loader from '~/ui/Loader'
import { Checkbox } from '~/ui/Checkbox/Checkbox'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'
import Dialog from '~/ui/Dialog'

const CharactersLimit = styled(Typography)(
  ({ theme }) => `
  font-size: 10px;
  color: ${theme.palette.gray300}
`
)

const Title = styled(Typography)`
  font-size: 24px;
  color: ${({ theme }) => theme.palette.gray800};
  font-weight: 400;
`

const Validate = styled(Button)(
  ({ theme }) => `
  color: ${theme.palette.whiteCorner};
  background: ${theme.palette.main};
  border: none;
  border-radius: 8px;
  height: 35px;
  &:hover {
    background: ${theme.palette.main};
  }
`
)

const messages = {
  create: 'Créer une action numérique',
  edit: 'Modifier une action numérique',
  charactersLimit: '(255 caractères)',
  title: 'Titre',
  text: 'Texte',
  url: 'URL',
  submit: 'Valider',
}

const riposteSchema = Yup.object({
  title: Yup.string().min(1, 'Minimum 1 caractère').max(255, 'Maximum 255 caractères').required('Titre obligatoire'),
  body: Yup.string().min(1, 'Minimum 1 caractère').required('Texte obligatoire'),
  url: Yup.string().url('Ce champ doit être une URL valide').required('Url obligatoire'),
})

const CreateEditModal = ({ open, riposte, onCloseResolve, createRiposte, updateRiposte, loader = false, errors }) => {
  const { isMobile } = useCurrentDeviceType()

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
    <Dialog open={open} handleClose={handleClose} data-cy="create-edit-modal">
      <form onSubmit={formik.handleSubmit}>
        <Grid container justifyContent="space-between" sx={{ mt: isMobile ? 2 : null, mb: 2 }}>
          <Grid item>
            <Title>{!riposte?.id ? messages.create : messages.edit}</Title>
          </Grid>
          <Grid item>
            <Button type="button" onClick={handleClose}>
              <ClearIcon />
            </Button>
          </Grid>
        </Grid>
        <Grid container sx={{ mb: 2 }}>
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
        <Grid container sx={{ mb: 2 }}>
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
        <Grid container sx={{ mb: 2 }}>
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
        <Grid container sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  id="withNotification"
                  size="small"
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
                <Checkbox id="status" size="small" checked={formik.values.status} onChange={formik.handleChange} />
              }
              label="Active"
            />
          </Grid>
        </Grid>
        <Grid container>
          <Validate type="submit" fullWidth>
            {loader ? <Loader size={12} color="white" /> : messages.submit}
          </Validate>
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
