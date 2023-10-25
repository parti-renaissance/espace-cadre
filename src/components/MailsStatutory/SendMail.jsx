import { useState } from 'react'
import { styled } from '@mui/system'
import { useMutation } from '@tanstack/react-query'
import { Button, Container, Grid, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  getMessage as getMessageApi,
  sendMessage as sendMessageApi,
  sendTestMessage as sendTestMessageApi,
} from 'api/messagerie'
import { useQueryWithScope } from 'api/useQueryWithScope'
import ModalComponent from 'components/Messagerie/Component/ModalComponent'
import { paths as messageriePaths } from 'components/Messagerie/shared/paths'
import pluralize from 'components/shared/pluralize/pluralize'
import { useErrorHandler } from 'components/shared/error/hooks'
import paths from 'shared/paths'
import PageHeader from 'ui/PageHeader'
import Loader from 'ui/Loader'

const AudienceCount = styled(Typography)`
  font-size: 18px;
  font-weight: 600;
`

const AddresseesCount = styled(Typography)`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.main};
`

const SendTest = styled(Button)(
  ({ theme }) => `
  color: ${theme.palette.main};
  border-color: ${theme.palette.main};
  &:hover {
    background: ${theme.palette.gray200};
    border-color: ${theme.palette.main};
  }
  width: 250px;
  height: 35px;
`
)

const Send = styled(Button)(
  ({ theme }) => `
  color: ${theme.palette.whiteCorner};
  background: ${theme.palette.main};
  &:hover {
    background: ${theme.palette.main};
  }
  &.Mui-disabled {
    color: ${theme.palette.button.color.disabled};
    background-color: ${theme.palette.button.background.disabled};
  }
  width: 250px;
  height: 35px;
`
)

const messages = {
  title: 'Mail statutaire',
  titleSuffix: 'Envoi du mail',
  previous: 'Précédent',
  addresseesCount: 'Vous allez envoyer un mail à',
  contact: 'contact',
  testMessage: "M'envoyer un mail de test",
  sendEmail: "Envoyer l'email",
}

const SendMail = () => {
  const { messageUuid } = useParams()
  const navigate = useNavigate()
  const [loadingTestButton, setLoadingTestButton] = useState(false)
  const [open, setOpen] = useState(false)
  const { handleError } = useErrorHandler()

  const { isLoading: loading, mutate: sendMessage } = useMutation({
    mutationFn: sendMessageApi,
    onSuccess: () => navigate(`../../${messageriePaths.confirmation}`),
    onError: handleError,
  })

  const { isLoading, data: message = {} } = useQueryWithScope(
    ['mail-statutory', { feature: 'MailsStatutory', view: 'SendMail' }, messageUuid],
    () => getMessageApi(messageUuid),
    {
      onError: handleError,
    }
  )

  const handleSendEmail = async (test = false) => {
    if (test) {
      setLoadingTestButton(true)
      const responseTest = await sendTestMessageApi(messageUuid)
      if (responseTest === 'OK') {
        setLoadingTestButton(false)
      }
    } else {
      sendMessage(messageUuid)
    }
  }

  return (
    <Container maxWidth={false}>
      <PageHeader title={messages.title} titleLink={paths.statutory_message} titleSuffix={messages.titleSuffix} />
      <Grid container sx={{ mb: 2 }}>
        <Link to="../../">
          <Button
            type="button"
            disableRipple
            sx={{ color: 'main' }}
            size="medium"
            startIcon={<ArrowBackIcon sx={{ display: 'flex', marginRight: 1 }} />}
          >
            {messages.previous}
          </Button>
        </Link>
      </Grid>
      <Grid container spacing={2} sx={{ textAlign: 'center' }}>
        <Grid container sx={{ mt: 2 }}>
          <Grid item xs={12}>
            {message && (
              <AudienceCount>
                {messages.addresseesCount}&nbsp;
                <AddresseesCount>{message.recipient_count || 0} </AddresseesCount>
                {pluralize(message.recipient_count, messages.contact)}
              </AudienceCount>
            )}
            {isLoading && <Loader />}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <SendTest
            variant="outlined"
            size="medium"
            onClick={() => handleSendEmail(true)}
            disabled={!message?.synchronized || loading || loadingTestButton}
          >
            {loadingTestButton ? <Loader /> : messages.testMessage}
          </SendTest>
        </Grid>
        <Grid item xs={12}>
          <Send
            variant="outlined"
            size="medium"
            disabled={!message?.synchronized || message?.recipient_count < 1 || loading || loadingTestButton}
            onClick={() => setOpen(true)}
            data-cy="send-mail-action"
          >
            {loading ? <Loader color="main" /> : messages.sendEmail}
          </Send>
          {open && (
            <ModalComponent
              open={open}
              recipientCount={message?.recipient_count || 0}
              handleClose={() => setOpen(false)}
              handleSendEmail={handleSendEmail}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default SendMail
