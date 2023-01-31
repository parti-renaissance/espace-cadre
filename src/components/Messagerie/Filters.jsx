/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Container, Grid, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DynamicFilters from '../Filters/DynamicFilters'
import { useUserScope } from '../../redux/user/hooks'
import useRetry from '../useRetry'
import PageHeader from 'ui/PageHeader'
import Loader from 'ui/Loader'
import ModalComponent from './Component/ModalComponent'
import {
  messageSynchronizationStatus as messageSynchronizationStatusApi,
  getMessage as getMessageApi,
  updateMessageFilter as updateMessageFilterApi,
  sendMessage as sendMessageApi,
  sendTestMessage as sendTestMessageApi,
} from 'api/messagerie'
import { paths as messageriePaths } from './shared/paths'
import paths from 'shared/paths'
import pluralize from 'components/shared/pluralize/pluralize'
import { styled } from '@mui/system'
import { useMutation } from 'react-query'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyMessages, notifyVariants } from 'components/shared/notification/constants'
import * as Sentry from '@sentry/react'

export const FEATURE_MESSAGES = 'messages'

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

const retryInterval = 2000
const maxAttempts = 10

const messages = {
  title: 'Messagerie',
  titleSuffix: 'Filtrer mon message',
  previous: 'Précédent',
  addresseesCount: 'Vous allez envoyer un message à',
  contact: 'contact',
  testMessage: "M'envoyer un message test",
  sendEmail: "Envoyer l'email",
  errorFilter: "Impossible d'appliquer les filtres, rechargez la page.",
  errorSynchro: "Le message n'est pas prêt à être envoyé",
}

const Filters = () => {
  const { messageUuid } = useParams()
  const navigate = useNavigate()
  const [currentScope] = useUserScope()
  const [loadingTestButton, setLoadingTestButton] = useState(false)
  const [open, setOpen] = useState(false)
  const [resetFilter, setResetFilter] = useState(0)
  const [isReadyToSend, setIsReadyToSend] = useState(false)
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()

  const { mutate: sendMessage } = useMutation(sendMessageApi, {
    onSuccess: () => {
      navigate(`../../${messageriePaths.confirmation}`)
    },
    onError: handleError,
  })

  const [loadingMessageStatus, message, getMessage] = useRetry(getMessageApi, retryInterval, maxAttempts, null, () => {
    Sentry.addBreadcrumb({
      category: 'messages',
      message: `${messages.errorFilter} id=${messageUuid}`,
      level: Sentry.Severity.Critical,
    })
    Sentry.captureMessage(messages.errorFilter)
    enqueueSnackbar(notifyMessages.warningTitle, notifyVariants.info, messages.errorFilter)
  })

  const [loadingSendButton, , sendMessageIfFiltersAreSaved] = useRetry(
    messageSynchronizationStatusApi,
    retryInterval,
    maxAttempts,
    () => prepareSendApi(),
    () => {
      Sentry.addBreadcrumb({
        category: 'messages',
        message: `${messages.errorSynchro} id=${messageUuid}`,
        level: Sentry.Severity.Critical,
      })
      Sentry.captureMessage(messages.errorSynchro)
      enqueueSnackbar(notifyMessages.errorTitle, notifyVariants.error, messages.errorSynchro)
    }
  )

  const { mutate: updateMessageFilter } = useMutation(updateMessageFilterApi, {
    onSuccess: () => getMessage(messageUuid),
    onError: handleError,
  })

  const defaultFilter = useMemo(() => ({ zone: currentScope.zones[0], resetFilter }), [currentScope, resetFilter])

  const handleFiltersSubmit = useCallback(
    async filtersToSend => {
      await updateMessageFilter({
        id: messageUuid,
        data: {
          ...filtersToSend,
          scope: currentScope.delegated_access?.type || currentScope.code,
          zone: filtersToSend.zone.uuid,
        },
      })
    },
    [messageUuid, updateMessageFilter, currentScope]
  )

  useEffect(() => {
    handleFiltersSubmit(defaultFilter)
  }, [defaultFilter, handleFiltersSubmit])

  useEffect(() => {
    if (isReadyToSend) {
      sendMessage(messageUuid)
    }
  }, [isReadyToSend])

  const handleSendEmail = async (test = false) => {
    if (test) {
      setLoadingTestButton(true)
      const responseTest = await sendTestMessageApi(messageUuid)
      if (responseTest === 'OK') {
        setLoadingTestButton(false)
      }
    } else {
      sendMessageIfFiltersAreSaved(messageUuid)
    }
  }

  const prepareSendApi = () => {
    if (!isReadyToSend) {
      setIsReadyToSend(true)
    }
  }

  return (
    <>
      <Container maxWidth={false}>
        <PageHeader title={messages.title} titleLink={paths.messages} titleSuffix={messages.titleSuffix} />
        <Grid container sx={{ mb: 2 }}>
          <Link to={`../${messageriePaths.update}`}>
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
          <Grid item>
            <DynamicFilters
              feature={FEATURE_MESSAGES}
              onSubmit={handleFiltersSubmit}
              values={defaultFilter}
              onReset={() => setResetFilter(p => p + 1)}
            />
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              {message && (
                <AudienceCount>
                  {messages.addresseesCount}&nbsp;
                  <AddresseesCount>{message.recipient_count || 0} </AddresseesCount>
                  {pluralize(message.recipient_count, messages.contact)}
                </AudienceCount>
              )}
              {loadingMessageStatus && <Loader />}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <SendTest
              variant="outlined"
              size="medium"
              onClick={() => {
                setLoadingTestButton(true)
                handleSendEmail(true)
              }}
              disabled={!message?.synchronized || loadingSendButton || loadingTestButton}
            >
              {loadingTestButton ? <Loader /> : messages.testMessage}
            </SendTest>
          </Grid>
          <Grid item xs={12}>
            <Send
              variant="outlined"
              size="medium"
              disabled={
                !message?.synchronized || message?.recipient_count < 1 || loadingSendButton || loadingTestButton
              }
              onClick={() => setOpen(true)}
            >
              {loadingSendButton ? <Loader color="main" /> : messages.sendEmail}
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
    </>
  )
}

export default Filters
