import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Container, Grid, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DynamicFilters from '../Filters/DynamicFilters'
import { useUserScope } from '../../redux/user/hooks'
import useRetry from '../useRetry'
import Loader from 'ui/Loader'
import ModalComponent from './Component/ModalComponent'
import {
  createSegmentAudience as createSegmentAudienceApi,
  updateSegmentAudience as updateSegmentAudienceApi,
  messageSynchronizationStatus as messageSynchronizationStatusApi,
  getSegmentAudience as getSegmentAudienceApi,
  sendMessage as sendMessageApi,
  sendTestMessage as sendTestMessageApi,
  setMessageSegment as setMessageSegmentApi,
} from 'api/messagerie'
import paths from 'components/Messagerie/shared/paths'
import pluralize from 'components/shared/pluralize/pluralize'
import { styled } from '@mui/system'
import { useMutation } from 'react-query'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyMessages, notifyVariants } from 'components/shared/notification/constants'
import * as Sentry from '@sentry/react'

export const FEATURE_MESSAGES = 'messages'

const Title = styled(Typography)(
  ({ theme }) => `
  font-size: 24px;
  font-weight: 400;
  color: ${theme.palette.blue600};
  margin-bottom: ${theme.spacing(2)}
`
)

const AudienceCount = styled(Typography)`
  font-size: 18px;
  font-weight: 600;
`

const AddresseesCount = styled(Typography)`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.blue800};
`

const SendTest = styled(Button)(
  ({ theme }) => `
  color: ${theme.palette.blue600};
  border-color: ${theme.palette.blue600};
  &:hover {
    background: ${theme.palette.gray200};
  }
  width: 250px;
  height: 35px;
`
)

const Send = styled(Button)(
  ({ theme }) => `
  color: ${theme.palette.whiteCorner};
  background: ${theme.palette.blue600};
  &:hover {
    background: ${theme.palette.blue800};
  }
  width: 250px;
  height: 35px;
`
)

const retryInterval = 1000
const maxAttempts = 10

const messages = {
  title: 'Messagerie > Filtrer mon message',
  previous: 'Précédent',
  addresseesCount: 'Vous allez envoyer un message à',
  contact: 'contact',
  testMessage: "M'envoyer un message test",
  sendEmail: "Envoyer l'email",
  errorFilter: "Impossible d'appliquer les filtres",
  errorSynchro: "Le message n'est pas prêt à être envoyé",
}

const Filters = () => {
  const { messageUuid } = useParams()
  const navigate = useNavigate()
  const [currentScope] = useUserScope()
  const [audienceId, setAudienceId] = useState(null)
  const [loadingTestButton, setLoadingTestButton] = useState(false)
  const [open, setOpen] = useState(false)
  const [resetFilter, setResetFilter] = useState(0)
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()

  const { mutate: sendMessage } = useMutation(sendMessageApi, {
    onSuccess: () => {
      navigate(`../../${paths.confirmation}`)
    },
    onError: handleError,
  })

  const [loadingSegment, audienceSegment, getSegmentAudience] = useRetry(
    getSegmentAudienceApi,
    retryInterval,
    maxAttempts,
    null,
    () => {
      Sentry.addBreadcrumb({
        category: 'messages',
        message: `${messages.errorFilter} id=${messageUuid}`,
        level: Sentry.Severity.Critical,
      })
      Sentry.captureMessage(messages.errorFilter)
      enqueueSnackbar(notifyMessages.errorTitle, notifyVariants.error, messages.errorFilter)
    }
  )

  const [loadingSendButton, , sendMessageIfFiltersAreSaved] = useRetry(
    messageSynchronizationStatusApi,
    retryInterval,
    maxAttempts,
    () => sendMessage(messageUuid),
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

  const { mutate: updateSegmentAudience } = useMutation(updateSegmentAudienceApi, {
    onSuccess: () => {
      getSegmentAudience(audienceId)
    },
    onError: handleError,
  })
  const { mutate: createSegmentAudience } = useMutation(createSegmentAudienceApi, {
    onSuccess: audience => {
      setAudienceId(audience.uuid)
      getSegmentAudience(audience.uuid)
    },
    onError: handleError,
  })

  const defaultFilter = useMemo(() => ({ zone: currentScope.zones[0], resetFilter }), [currentScope, resetFilter])

  const handleFiltersSubmit = useCallback(
    async filtersToSend => {
      const filterObject = {
        filter: {
          ...filtersToSend,
          ...{
            scope: currentScope.delegated_access?.type || currentScope.code,
            zone: filtersToSend.zone.uuid,
          },
        },
      }

      if (audienceId) {
        await updateSegmentAudience({ ...{ id: audienceId }, ...filterObject })
      } else {
        await createSegmentAudience(filterObject)
      }
    },
    [audienceId, createSegmentAudience, currentScope, updateSegmentAudience]
  )

  useEffect(() => {
    handleFiltersSubmit(defaultFilter)
  }, [defaultFilter, handleFiltersSubmit])

  const handleSendEmail = async (test = false) => {
    if (test) {
      setLoadingTestButton(true)
      const responseTest = await sendTestMessageApi(messageUuid)
      if (responseTest === 'OK') {
        setLoadingTestButton(false)
      }
    } else {
      await setMessageSegmentApi(messageUuid, audienceId)
      sendMessageIfFiltersAreSaved(messageUuid)
    }
  }

  return (
    <>
      <Container maxWidth="xl">
        <Title>{messages.title}</Title>
        <Grid container>
          <Link to={`../${paths.update}`}>
            <Button
              type="button"
              disableRipple
              sx={{ color: 'blue600' }}
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
              {audienceSegment && (
                <AudienceCount>
                  {messages.addresseesCount}&nbsp;
                  <AddresseesCount>{audienceSegment.recipient_count || 0} </AddresseesCount>
                  {pluralize(audienceSegment.recipient_count, messages.contact)}
                </AudienceCount>
              )}
              {loadingSegment && <Loader />}
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
              disabled={
                !audienceSegment?.synchronized ||
                audienceSegment?.recipient_count < 1 ||
                loadingSendButton ||
                loadingTestButton
              }
            >
              {loadingTestButton ? <Loader /> : messages.testMessage}
            </SendTest>
          </Grid>
          <Grid item xs={12}>
            <Send
              variant="outlined"
              size="medium"
              disabled={
                !audienceSegment?.synchronized ||
                audienceSegment?.recipient_count < 1 ||
                loadingSendButton ||
                loadingTestButton
              }
              onClick={() => setOpen(true)}
            >
              {loadingSendButton ? <Loader color="white" /> : messages.sendEmail}
            </Send>
            {open && (
              <ModalComponent
                open={open}
                recipientCount={audienceSegment?.recipient_count || 0}
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
