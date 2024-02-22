/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CardContent, Card, CircularProgress, Typography, Stack } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import DynamicFilters from '../../../Filters/DynamicFilters'
import { useUserScope } from '~/redux/user/hooks'
import useRetry from '../../../useRetry'
import ManageLayout from './Layout'
import ModalComponent from '../../Component/ModalComponent'
import {
  messageSynchronizationStatus as messageSynchronizationStatusApi,
  getMessage as getMessageApi,
  updateMessageFilter as updateMessageFilterApi,
  sendMessage as sendMessageApi,
  sendTestMessage as sendTestMessageApi,
} from '~/api/messagerie'
import pluralize from '~/components/shared/pluralize/pluralize'
import { useMutation } from '@tanstack/react-query'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { notifyMessages, notifyVariants } from '~/components/shared/notification/constants'
import * as Sentry from '@sentry/react'
import features from '~/shared/features'
import { LoadingButton } from '@mui/lab'
import { grey } from '~/theme/palette'

const retryInterval = 2000
const maxAttempts = 10

const messages = {
  title: 'Destinataires',
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
  const { id: messageUuid } = useParams()
  const navigate = useNavigate()
  const [currentScope] = useUserScope()
  const [loadingTestButton, setLoadingTestButton] = useState(false)
  const [open, setOpen] = useState(false)
  const [disabledAction, setDisabledAction] = useState(false)
  const [resetFilter, setResetFilter] = useState(0)
  const [isReadyToSend, setIsReadyToSend] = useState(false)
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()

  const { mutate: sendMessage, isLoading: isMessageSending } = useMutation(sendMessageApi, {
    onSuccess: () => {
      navigate('/messagerie')
      enqueueSnackbar(notifyMessages.successSentTitle, notifyVariants.success, notifyMessages.successSentDetail)
    },
    onError: handleError,
  })

  const [loadingMessageStatus, message, getMessage] = useRetry(getMessageApi, retryInterval, maxAttempts, null, () => {
    Sentry.addBreadcrumb({
      category: 'messages',
      message: `${messages.errorFilter} id=${messageUuid}`,
      level: 'error',
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
        level: 'error',
      })
      Sentry.captureMessage(messages.errorSynchro)
      enqueueSnackbar(notifyMessages.errorTitle, notifyVariants.error, messages.errorSynchro)
    }
  )

  const defaultFilter = useMemo(() => ({ zone: currentScope.zones[0] || [], resetFilter }), [currentScope, resetFilter])

  const { mutate: updateMessageFilter } = useMutation(
    filtersToSend =>
      updateMessageFilterApi({
        id: messageUuid,
        data: {
          ...filtersToSend,
          scope: currentScope.getMainCode(),
          zone: filtersToSend.zone?.uuid,
        },
      }),
    {
      onSuccess: () => getMessage(messageUuid),
      onError: handleError,
    }
  )

  const handleFiltersSubmit = useCallback(
    async filtersToSend => {
      updateMessageFilter(filtersToSend)
      setDisabledAction(false)
    },
    [messageUuid, updateMessageFilter, currentScope]
  )

  const handleOnReset = () => {
    setResetFilter(0)
    setDisabledAction(false)
    handleFiltersSubmit(defaultFilter)
  }

  useEffect(() => {
    handleFiltersSubmit(defaultFilter)
    setDisabledAction(false)
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
    <ManageLayout title={messages.title} subtitle={messages.titleSuffix}>
      <Stack spacing={4}>
        <Card>
          <CardContent>
            <DynamicFilters
              feature={features.messages}
              onSubmit={handleFiltersSubmit}
              values={defaultFilter}
              onReset={handleOnReset}
              onValuesChange={() => setDisabledAction(true)}
              buttonContainerStyle={{ justifyItems: 'center', alignItems: 'center' }}
            />
          </CardContent>
        </Card>
        <Card variant="outlined">
          <Stack
            item
            xs={12}
            sx={{ p: 2 }}
            bgcolor={grey[200]}
            minHeight="80px"
            justifyContent="center"
            alignItems="center"
          >
            {message && (
              <>
                <Typography variant="h3">{message.recipientCount || 0} </Typography>
                <Typography variant="subtitle1">
                  {pluralize(message.recipientCount, 'Contact')} {pluralize(message.recipientCount, 'selectionné')}
                </Typography>
              </>
            )}
            {loadingMessageStatus && <CircularProgress />}
          </Stack>
        </Card>
        <Stack spacing={2} width="100%" direction="row" justifyContent="flex-end" alignItems="end" sx={{ mt: 2 }}>
          <LoadingButton
            variant="outlined"
            size="large"
            loading={loadingTestButton}
            onClick={() => {
              setLoadingTestButton(true)
              handleSendEmail(true)
            }}
            disabled={
              !message?.isSynchronized || loadingSendButton || loadingTestButton || disabledAction || isMessageSending
            }
          >
            {messages.testMessage}
          </LoadingButton>
          <LoadingButton
            variant="contained"
            size="large"
            loading={loadingSendButton}
            disabled={
              !message?.isSynchronized ||
              message?.recipientCount < 1 ||
              loadingSendButton ||
              loadingTestButton ||
              disabledAction ||
              isMessageSending
            }
            onClick={() => setOpen(true)}
            data-cy="send-mail-action"
          >
            {messages.sendEmail}
          </LoadingButton>
        </Stack>
        {open && (
          <ModalComponent
            open={open}
            recipientCount={message?.recipientCount || 0}
            handleClose={() => setOpen(false)}
            handleSendEmail={handleSendEmail}
          />
        )}
      </Stack>
    </ManageLayout>
  )
}

export default Filters
