import { Grid, IconButton } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import PropTypes from 'prop-types'
import { useMutation } from '@tanstack/react-query'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useSelector } from 'react-redux'
import { notifyVariants } from '~/components/shared/notification/constants'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { createNewsQuery, updateNewsQuery } from '~/api/news'
import DomainNews from '~/domain/news'
import TextField from '~/ui/TextField'
import UIFormMessage from '~/ui/FormMessage/FormMessage'
import { useUserScope } from '../../redux/user/hooks'
import Loader from '~/ui/Loader'
import NotificationContainer from './NotificationContainer'
import CallToActionContainer from './CallToActionContainer'
import MarkdownEditor from '~/ui/MarkdownEditor'
import NewsAlertImage from '~/assets/newsAlertImage.svg'
import NewsAlert from '../shared/alert/NewsAlert'
import { SubTitle, Title } from './styles'
import Button from '~/ui/Button'
import Dialog from '~/ui/Dialog'
import { EDITOR_IMAGE_UPLOAD_URL } from './constants'
import scopes from '~/shared/scopes'

const newsSchema = Yup.object({
  title: Yup.string().min(1, 'Minimum 1 caractère').max(120, 'Maximum 120 caractères').required('Titre obligatoire'),
  body: Yup.string().min(1, 'Minimum 1 caractère').max(10000, 'Maximum 10000 caractères').required('Texte obligatoire'),
  url: Yup.string().url('Ce champ doit être une URL valide'),
})

const messages = {
  title: 'Titre',
  body: 'Contenu',
  createNews: 'Nouvelle actualité',
  editNews: "Modifier l'actualité",
  editNewsSubmit: 'Mettre à jour',
  createSuccess: 'Actualité créée avec succès',
  editSuccess: "L'actualité a bien été modifiée",
  submit: 'Envoyer l’actualité',
  charactersLimit1: '(120 caractères)',
  charactersLimit2: '(1000 caractères)',
  charactersLimit3: '(255 caractères)',
  titlePlaceholder: 'Donnez un titre à votre actualité',
  newsAlertTitle: '🎉 NOUVEAU',
  newsAlertContent: 'Mettez en forme vos actualités, elles seront consultables dans l’application mobile.',
}

const CreateEditModal = ({ open, news, onCloseResolve, onSubmitResolve }) => {
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages, resetErrorMessages } = useErrorHandler()
  const [currentScope] = useUserScope()
  const { isMobile } = useCurrentDeviceType()
  const isEditMode = news?.id ? true : false
  const accessToken = useSelector(state => state.auth.tokens.accessToken)

  const { mutateAsync: createOrEditNews, isLoading: isCreateOrUpdateLoading } = useMutation(
    !isEditMode ? createNewsQuery : updateNewsQuery,
    {
      onSuccess: async () => {
        const successMessage = !isEditMode ? messages.createSuccess : messages.editSuccess
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
      urlLabel: news?.urlLabel || '',
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
          .withUrlLabel(values.urlLabel)
          .withWithNotification(values.withNotification)
          .withStatus(values.status)
          .withZoneId(currentScope.code === scopes.national ? null : currentScope.zones[0].uuid)
      )
    },
  })

  const newsInputHandler = (_, editor) => {
    formik.setFieldValue('body', editor.getData())
  }

  const editorConfiguration = {
    toolbar: ['bold', 'italic', '|', 'bulletedList', 'numberedList', '|', 'link', 'ImageUpload'],
    simpleUpload: {
      uploadUrl: `${EDITOR_IMAGE_UPLOAD_URL}scope=${currentScope.code}`,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  }

  return (
    <Dialog open={open} handleClose={handleClose} disableEnforceFocus={true} data-testid="create-modal">
      <form>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2, ...(isMobile && { mt: 2 }) }}>
          <Title>{news?.id ? messages.editNews : messages.createNews}</Title>
          <IconButton onClick={handleClose}>
            <CloseRoundedIcon />
          </IconButton>
        </Grid>
        <Grid container sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <SubTitle>{messages.title}</SubTitle>
          </Grid>
          <Grid item xs={12}>
            <TextField formik={formik} label="title" placeholder={messages.titlePlaceholder} />
          </Grid>
          {errorMessages
            .filter(({ field }) => field === 'title')
            .map(({ field, message }) => (
              <Grid item xs={12} key={field}>
                <UIFormMessage severity="error">{message}</UIFormMessage>
              </Grid>
            ))}
        </Grid>
        <NewsAlert title={messages.newsAlertTitle} content={messages.newsAlertContent} image={NewsAlertImage} />
        <Grid container sx={{ mb: 2 }}>
          <Grid item xs={12} sx={{ mb: 1 }}>
            <SubTitle>{messages.body}</SubTitle>
          </Grid>
          <Grid item xs={12}>
            <MarkdownEditor
              formik={formik}
              data={formik.values['body']}
              label="body"
              config={editorConfiguration}
              onChange={newsInputHandler}
            />
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
            <CallToActionContainer formik={formik} isDisabled={isEditMode} />
          </Grid>
        </Grid>

        <Grid container sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <NotificationContainer formik={formik} isDisabled={isEditMode} />
          </Grid>
        </Grid>

        <Grid container sx={{ mb: 2 }}>
          <Button
            type="submit"
            onClick={formik.handleSubmit}
            rootProps={{ sx: { color: 'whiteCorner', width: '100%' } }}
            disabled={isCreateOrUpdateLoading}
          >
            {isCreateOrUpdateLoading ? (
              <Loader size={12} color="white" />
            ) : news?.id ? (
              messages.editNewsSubmit
            ) : (
              messages.submit
            )}
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
