/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Button, Container, Grid, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DynamicFilters from '../../../Filters/DynamicFilters'
import { useUserScope } from '../../../../redux/user/hooks'
import useRetry from '../../../useRetry'
import PageHeader from '~/ui/PageHeader'
import Loader from '~/ui/Loader'
import ModalComponent from '../../Component/ModalComponent'
import {
  messageSynchronizationStatus as messageSynchronizationStatusApi,
  getMessage as getMessageApi,
  updateMessageFilter as updateMessageFilterApi,
  sendMessage as sendMessageApi,
  sendTestMessage as sendTestMessageApi,
} from '~/api/messagerie'
import { paths as messageriePaths } from '../../shared/paths'
import paths from '~/shared/paths'
import pluralize from '~/components/shared/pluralize/pluralize'
import { styled } from '@mui/system'
import { useMutation } from '@tanstack/react-query'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { notifyMessages, notifyVariants } from '~/components/shared/notification/constants'
import * as Sentry from '@sentry/react'
import features from '~/shared/features'

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

  const { mutate: updateMessageFilter } = useMutation(updateMessageFilterApi, {
    onSuccess: () => getMessage(messageUuid),
    onError: handleError,
  })

  const defaultFilter = useMemo(() => ({ zone: currentScope.zones[0] || [], resetFilter }), [currentScope, resetFilter])

  const handleFiltersSubmit = useCallback(
    async filtersToSend => {
      await updateMessageFilter({
        id: messageUuid,
        data: {
          ...filtersToSend,
          scope: currentScope.getMainCode(),
          zone: filtersToSend.zone?.uuid,
        },
      })
      setDisabledAction(false)
    },
    [messageUuid, updateMessageFilter, currentScope]
  )

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
    <>
      <Container maxWidth={false}>
        <Grid container spacing={2} sx={{ textAlign: 'center' }}>
          <Grid item>
            <Accordion data-cy="accordion-filters-container">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-filter-content"
                id="panel-filter-header"
                sx={{ backgroundColor: 'whiteCorner', borderTop: 'none' }}
              >
                <Typography>Appliquer des filtres</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'colors.gray.50', pt: 2.5 }}>
                <DynamicFilters
                  feature={features.messages}
                  onSubmit={handleFiltersSubmit}
                  values={defaultFilter}
                  onReset={() => {
                    setResetFilter(0), setDisabledAction(false)
                  }}
                  onValuesChange={() => setDisabledAction(true)}
                  buttonContainerStyle={{ justifyItems: 'center', alignItems: 'center' }}
                />
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid container sx={{ mt: 2 }}>
            <Grid item xs={12}>
              {message && (
                <AudienceCount>
                  {messages.addresseesCount}&nbsp;
                  <AddresseesCount>{message.recipientCount || 0} </AddresseesCount>
                  {pluralize(message.recipientCount, messages.contact)}
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
              disabled={!message?.isSynchronized || loadingSendButton || loadingTestButton || disabledAction}
            >
              {loadingTestButton ? <Loader /> : messages.testMessage}
            </SendTest>
          </Grid>
          <Grid item xs={12}>
            <Send
              variant="outlined"
              size="medium"
              disabled={
                !message?.isSynchronized ||
                message?.recipientCount < 1 ||
                loadingSendButton ||
                loadingTestButton ||
                disabledAction
              }
              onClick={() => setOpen(true)}
              data-cy="send-mail-action"
            >
              {loadingSendButton ? <Loader color="main" /> : messages.sendEmail}
            </Send>
            {open && (
              <ModalComponent
                open={open}
                recipientCount={message?.recipientCount || 0}
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
