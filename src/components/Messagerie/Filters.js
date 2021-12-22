import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Button, Container, Grid, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
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
  messageSynchronizationStatus,
  getSegmentAudience as getSegmentAudienceApi,
  sendMessage as sendMessageApi,
  sendTestMessage,
  setMessageSegment,
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

const useStyles = makeStyles(theme => ({
  container: {
    textAlign: 'center',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '400',
    color: theme.palette.blue600,
    marginBottom: theme.spacing(2),
  },
  addresseesCount: {
    color: theme.palette.blue800,
  },
  sendTestButton: {
    color: theme.palette.blue600,
    borderColor: theme.palette.blue600,
    '&:hover': {
      background: theme.palette.gray200,
    },
    width: '250px',
    height: '35px',
  },
  sendButton: {
    color: theme.palette.whiteCorner,
    background: theme.palette.blue600,
    '&:hover': {
      background: theme.palette.blue800,
    },
    width: '250px',
    height: '35px',
  },
  success: {
    color: `${theme.palette.successButton} !important`,
    background: `${theme.palette.whiteCorner} !important`,
  },
  backButton: {
    color: theme.palette.blue600,
  },
  buttonIcon: {
    display: 'flex',
    marginRight: theme.spacing(1),
  },
}))

const AudienceCount = styled(Typography)`
  font-size: 18px;
  font-weight: 600;
`

const retryInterval = 1000
const maxAttempts = 10

const messages = {
  filtersTitle: 'Messagerie > Filtrer mon message',
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
  const classes = useStyles()
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
    messageSynchronizationStatus,
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
      const filterWithZoneId = { ...filtersToSend, zone: filtersToSend.zone.uuid }
      if (audienceId) {
        await updateSegmentAudience({
          id: audienceId,
          filter: { ...{ scope: currentScope.code }, ...filterWithZoneId },
        })
      } else {
        await createSegmentAudience({
          filter: { ...{ scope: currentScope.code }, ...filterWithZoneId },
        })
      }
    },
    [audienceId, createSegmentAudience, currentScope.code, updateSegmentAudience]
  )

  useEffect(() => {
    handleFiltersSubmit(defaultFilter)
  }, [defaultFilter, handleFiltersSubmit])

  const handleSendEmail = async (test = false) => {
    if (test) {
      setLoadingTestButton(true)
      const responseTest = await sendTestMessage(messageUuid)
      if (responseTest === 'OK') {
        setLoadingTestButton(false)
      }
    } else {
      await setMessageSegment(messageUuid, audienceId)
      sendMessageIfFiltersAreSaved(messageUuid)
    }
  }

  return (
    <>
      <Container maxWidth="xl">
        <Box className={classes.pageTitle}>{messages.filtersTitle}</Box>
        <Grid container>
          <Link to={`../${paths.update}`}>
            <Button
              type="button"
              disableRipple
              className={classes.backButton}
              size="medium"
              startIcon={<ArrowBackIcon className={classes.buttonIcon} />}
            >
              {messages.previous}
            </Button>
          </Link>
        </Grid>
        <Grid container spacing={2} className={classes.container}>
          <Grid item>
            <DynamicFilters
              feature={FEATURE_MESSAGES}
              onSubmit={handleFiltersSubmit}
              values={defaultFilter}
              onReset={() => setResetFilter(p => p + 1)}
            />
          </Grid>
          <Grid container>
            <Grid item xs={12} sx={{ color: 'gray700', mb: 3, height: '30px' }}>
              {audienceSegment && (
                <div className={classes.message}>
                  <AudienceCount>
                    {messages.addresseesCount}&nbsp;
                    <span className={classes.addresseesCount}>{audienceSegment.recipient_count || 0} </span>
                    {pluralize(audienceSegment.recipient_count, messages.contact)}
                  </AudienceCount>
                </div>
              )}
              {loadingSegment && <Loader />}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              size="medium"
              className={classes.sendTestButton}
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
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              size="medium"
              className={classes.sendButton}
              disabled={
                !audienceSegment?.synchronized ||
                audienceSegment?.recipient_count < 1 ||
                loadingSendButton ||
                loadingTestButton
              }
              onClick={() => setOpen(true)}
            >
              {loadingSendButton ? <Loader color="white" /> : messages.sendEmail}
            </Button>
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
