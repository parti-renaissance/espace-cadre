import * as Sentry from '@sentry/react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Grid, Container as MuiContainer } from '@mui/material'
import { styled } from '@mui/system'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { createMessageContent, getMessageContent, getTemplate, updateMessageContent } from '~/api/messagerie'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { useErrorHandler } from '~/components/shared/error/hooks'
import paths from '~/shared/paths'
import Input from '~/ui/Input/Input'
import PageHeader from '~/ui/PageHeader'
import Editor from './Component/Editor'
import StepButton from './Component/StepButton'
import { notifyVariants, notifyMessages } from '../shared/notification/constants'
import { useCustomSnackbar } from '../shared/notification/hooks'
import { paths as messageriePaths } from './shared/paths'
import { useUserScope } from '../../redux/user/hooks'

const clearBody = body => body.substring(body.indexOf('<table'), body.lastIndexOf('</table>') + 8)

const Container = styled(Grid)(
  ({ theme }) => `
  background: ${theme.palette.colors.white};
  padding: ${theme.spacing(2)};
  border-radius: 12px 12px 0 0;
`
)

const messages = {
  title: 'Messagerie',
  titleSuffix: 'Créer un message',
  createSuccess: 'Message créé avec succès',
  updateSuccess: 'Message modifié avec succès',
}

const Template = ({ modeUpdate = false }) => {
  const [messageSubject, setMessageSubject] = useState('')
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentScope] = useUserScope()
  const { handleError } = useErrorHandler()
  const navigate = useNavigate()
  const { messageUuid } = useParams()
  const [searchParams] = useSearchParams()
  const templateId = searchParams.get('templateId')
  const { enqueueSnackbar } = useCustomSnackbar()

  const editEmail = () => {
    const body = {
      type: currentScope.getMainCode(),
      label: `DataCorner: ${messageSubject}`,
      subject: messageSubject,
      content: clearBody(message.chunks.body),
      json_content: JSON.stringify(message.design),
    }

    if (messageUuid) {
      return updateMessageContent(messageUuid, body)
    }
    return createMessageContent(body)
  }

  const handleClickNext = async () => {
    try {
      setLoading(true)
      const body = await editEmail()
      setMessage(body)
      enqueueSnackbar(modeUpdate ? messages.updateSuccess : messages.createSuccess, notifyVariants.success)
      modeUpdate ? navigate(`../${messageriePaths.filter}`) : navigate(`../${body.uuid}/${messageriePaths.filter}`)
    } catch (e) {
      Sentry.captureException(e)
      enqueueSnackbar(notifyMessages.errorTitle, notifyVariants.error)
    }
  }

  const { data: messageContent = null } = useQueryWithScope(
    ['message-content-template', { feature: 'Messagerie', view: 'TemplateEditor', templateId, messageUuid }],
    () => (templateId ? getTemplate(templateId) : getMessageContent(messageUuid)),
    { onError: handleError, enabled: !!messageUuid || !!templateId }
  )

  return (
    <MuiContainer maxWidth={false}>
      <PageHeader title={messages.title} titleLink={paths.messages} titleSuffix={messages.titleSuffix} />
      <Container container>
        <Grid item xs={4} sx={{ justifyContent: 'spaceBetween', mr: 2 }}>
          <Input
            size="small"
            label="Objet du mail"
            variant="outlined"
            value={messageSubject}
            onChange={event => setMessageSubject(event.target.value)}
            sx={{ width: '100%' }}
            data-cy="mail-object-input"
          />
        </Grid>
        <Grid item xs={5} />
        <Grid item xs>
          <StepButton
            label="Suivant"
            loading={loading}
            disabled={loading || !messageSubject || !message}
            onClick={handleClickNext}
          />
        </Grid>
      </Container>
      <Editor
        onMessageSubject={setMessageSubject}
        onMessageUpdate={setMessage}
        messageContent={messageContent}
        key={messageContent?.uuid}
      />
    </MuiContainer>
  )
}

export default Template

Template.propTypes = {
  modeUpdate: PropTypes.bool,
}
