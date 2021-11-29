import { useState } from 'react'
import { Dialog, Paper, Grid, Button as MuiButton, FormControlLabel, Checkbox, Typography } from '@mui/material'
import MuiCloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import TextField from 'ui/TextField'
import AlertBanner from 'ui/AlertBanner'
import { createNews, updateNews } from 'api/news'
import DomainNews from 'domain/news'
import { notifyMessages, notifyVariants } from '../shared/notification/constants'
import { useCustomSnackbar } from '../shared/notification/hooks'

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
  color: ${theme.palette.whiteCorner};
  background: ${theme.palette.orange500};
  border: none;
  border-radius: 8.35px;
  &:hover {
    background-color: ${theme.palette.orange600};
  }
`
)

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
  submit: 'Valider',
  charactersLimit1: '(120 charactères)',
  charactersLimit2: '(1000 charactères)',
  charactersLimit3: '(255 charactères)',
}

const CreateEditModal = ({ handleClose, news, onSubmitRefresh, open }) => {
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
            {errorMessage && <AlertBanner severity="error" message={errorMessage} />}
          </Grid>
        </Grid>
        <Grid container sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: 600 }}>{messages.title}</Typography>{' '}
            <CharactersLimit>{messages.charactersLimit1}</CharactersLimit>
          </Grid>
          <Grid item xs={12}>
            <TextField formik={formik} label="title" />
          </Grid>
        </Grid>
        <Grid container sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: 600 }}>Texte</Typography>{' '}
            <CharactersLimit>{messages.charactersLimit2}</CharactersLimit>
          </Grid>
          <Grid item xs={12}>
            <TextField formik={formik} label="body" isLong />
          </Grid>
        </Grid>
        <Grid container sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: 600 }}>URL</Typography>{' '}
            <CharactersLimit>{messages.charactersLimit3}</CharactersLimit>
          </Grid>
          <Grid item xs={12}>
            <TextField formik={formik} label="url" />
          </Grid>
        </Grid>
        <Grid container sx={{ mb: 2 }}>
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
        <Grid container sx={{ mb: 2 }}>
          <Button type="submit" fullWidth>
            {messages.submit}
          </Button>
        </Grid>
      </form>
    </Dialog>
  )
}

export default CreateEditModal

CreateEditModal.defaultProps = {
  handleClose: () => {},
  onSubmitRefresh: () => {},
  news: null,
}

CreateEditModal.propTypes = {
  handleClose: PropTypes.func,
  onSubmitRefresh: PropTypes.func,
  news: DomainNews.propTypes,
  open: PropTypes.bool.isRequired,
}
