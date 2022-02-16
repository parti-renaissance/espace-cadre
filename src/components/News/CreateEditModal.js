import { Dialog, Paper, Grid, Button as MuiButton, FormControlLabel, Checkbox, Typography } from '@mui/material'
import MuiCloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import { useMutation } from 'react-query'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { notifyVariants } from 'components/shared/notification/constants'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import { createNewsQuery, updateNewsQuery } from 'api/news'
import DomainNews from 'domain/news'
import TextField from 'ui/TextField'
import UIFormMessage from 'ui/FormMessage/FormMessage'
import { useUserScope } from '../../redux/user/hooks'
import Loader from 'ui/Loader'

const StyledPaper = styled(Paper)(
  ({ theme }) => `
  padding: ${theme.spacing(4)};
  width: 664px;
  border-radius: 12px;
`
)

const CloseIcon = styled(MuiCloseIcon)(
  ({ theme }) => `
  color: ${theme.palette.gray700};
  cursor: pointer;
`
)

const Title = styled(Typography)(
  ({ theme }) => `
  font-size: 24px;
  color: ${theme.palette.gray800};
  font-weight: 400;
`
)

const CharactersLimit = styled(Typography)(
  ({ theme }) => `
  font-size: 10px;
  color: ${theme.palette.gray300}
`
)

const Button = styled(MuiButton)(
  ({ theme }) => `
  color: ${theme.palette.campaign.button.color.main};
  background: ${theme.palette.campaign.button.background.main};
  border: none;
  border-radius: 8px;
  &:hover {
    color: ${theme.palette.campaign.button.color.main};
    background-color: ${theme.palette.campaign.button.background.main};
  }
`
)

const newsSchema = Yup.object({
  title: Yup.string().min(1, 'Minimum 1 charactère').max(120, 'Maximum 120 charactères').required('Titre obligatoire'),
  body: Yup.string().min(1, 'Minimum 1 charactère').max(1000, 'Maximum 1000 charactères').required('Texte obligatoire'),
  url: Yup.string().url('Ce champ doit être une URL valide'),
})

const messages = {
  title: 'Titre',
  createNews: 'Nouvelle actualité',
  editNews: "Modifier l'actualité",
  createSuccess: 'Actualité créée avec succès',
  editSuccess: "L'actualité a bien été modifiée",
  submit: 'Valider',
  charactersLimit1: '(120 caractères)',
  charactersLimit2: '(1000 caractères)',
  charactersLimit3: '(255 caractères)',
}

const CreateEditModal = ({ open, news, onCloseResolve, onSubmitResolve }) => {
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages, resetErrorMessages } = useErrorHandler()
  const [currentScope] = useUserScope()

  const { mutateAsync: createOrEditNews, isLoading: isCreateOrUpdateLoading } = useMutation(
    !news?.id ? createNewsQuery : updateNewsQuery,
    {
      onSuccess: async () => {
        const successMessage = !news?.id ? messages.createSuccess : messages.editSuccess
        await onSubmitResolve()
        enqueueSnackbar(successMessage, notifyVariants.success)
        handleClose()
      },
      onError: handleError,
    }
  )

  const handleClose = () => {
    onCloseResolve()
    resetErrorMessages()
  }

  const formik = useFormik({
    initialValues: {
      title: news?.title,
      body: news?.body,
      url: news?.url || '',
      withNotification: news?.withNotification,
      status: news?.status,
    },
    validationSchema: newsSchema,
    enableReinitialize: true,
    onSubmit: values => {
      createOrEditNews(
        news
          .withTitle(values.title)
          .withBody(values.body)
          .withUrl(values.url)
          .withWithNotification(values.withNotification)
          .withStatus(values.status)
          .withZoneId(currentScope.code === 'national' ? null : currentScope.zones[0].uuid)
      )
    },
  })

  return (
    <Dialog open={open} onClose={handleClose} PaperComponent={StyledPaper}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container justifyContent="space-between" sx={{ marginBottom: 2 }}>
          <Grid item>
            <Title>{news?.id ? messages.editNews : messages.createNews}</Title>
          </Grid>
          <Grid item>
            <CloseIcon onClick={handleClose} />
          </Grid>
        </Grid>
        <Grid container sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: 600 }}>{messages.title}</Typography>&nbsp;
            <CharactersLimit>{messages.charactersLimit1}</CharactersLimit>
          </Grid>
          <Grid item xs={12}>
            <TextField formik={formik} label="title" />
          </Grid>
          {errorMessages
            .filter(({ field }) => field === 'title')
            .map(({ field, message }) => (
              <Grid item xs={12} key={field}>
                <UIFormMessage severity="error">{message}</UIFormMessage>
              </Grid>
            ))}
        </Grid>
        <Grid container sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: 600 }}>Texte</Typography>&nbsp;
            <CharactersLimit>{messages.charactersLimit2}</CharactersLimit>
          </Grid>
          <Grid item xs={12}>
            <TextField formik={formik} label="body" inputProps={{ maxLength: 1000 }} />
          </Grid>
          {errorMessages
            .filter(({ field }) => field === 'text')
            .map(({ field, message }) => (
              <Grid item xs={12} key={field}>
                <UIFormMessage severity="error">{message}</UIFormMessage>
              </Grid>
            ))}
        </Grid>
        <Grid container sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: 600 }}>URL</Typography>&nbsp;
            <CharactersLimit>{messages.charactersLimit3}</CharactersLimit>
          </Grid>
          <Grid item xs={12}>
            <TextField formik={formik} label="url" />
          </Grid>
          {errorMessages
            .filter(({ field }) => field === 'external_link')
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
                  name="withNotification"
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
                  name="status"
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

        <Grid container sx={{ mb: 2 }}>
          <Button type="submit" fullWidth sx={{ height: '35px' }}>
            {isCreateOrUpdateLoading ? <Loader size={12} color="white" /> : messages.submit}
          </Button>
        </Grid>
      </form>
    </Dialog>
  )
}

export default CreateEditModal

CreateEditModal.defaultProps = {
  news: null,
}

CreateEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  news: DomainNews.propTypes,
  onCloseResolve: PropTypes.func.isRequired,
  onSubmitResolve: PropTypes.func.isRequired,
}
