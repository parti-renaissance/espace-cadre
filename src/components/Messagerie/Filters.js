import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Button, Container, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DynamicFilters from '../Filters/DynamicFilters'
import { useUserScope } from '../../redux/user/hooks'
import useRetry from '../useRetry'
import ErrorComponent from 'components/ErrorComponent'
import Loader from 'ui/Loader'
import ModalComponent from './Component/ModalComponent'
import {
  createSegmentAudience,
  messageSynchronizationStatus,
  getSegmentAudience,
  sendMessage,
  sendTestMessage,
  setMessageSegment,
  updateSegmentAudience,
} from 'api/messagerie'
import paths from 'components/Messagerie/shared/paths'
import pluralize from 'components/shared/pluralize/pluralize'

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
  messageContainer: {
    fontWeight: '600',
    fontSize: '18px',
    color: theme.palette.gray700,
    marginBottom: theme.spacing(3),
  },
  message: {
    height: '30px',
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
  },
  sendButton: {
    color: theme.palette.whiteCorner,
    background: theme.palette.blue600,
    '&:hover': {
      background: theme.palette.blue800,
    },
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

const retryInterval = 1000
const maxAttempts = 10

const messages = {
  filtersTitle: 'Messagerie > Filtrer mon message',
  previous: 'Précédent',
  addresseesCount: 'Vous allez envoyer un message à',
  contact: 'contact',
  testMessage: "M'envoyer un message test",
}

const Filters = () => {
  const { messageUuid } = useParams()
  const navigate = useNavigate()
  const classes = useStyles()
  const [currentScope] = useUserScope()
  const [audienceId, setAudienceId] = useState(null)
  const [errorMessage, setErrorMessage] = useState()
  const [loadingTestButton, setLoadingTestButton] = useState(false)
  const [open, setOpen] = useState(false)
  const [resetFilter, setResetFilter] = useState(0)
  const [loadingSegment, audienceSegment, launch] = useRetry(getSegmentAudience, retryInterval, maxAttempts)

  const sendMessageAfterFilterAreSaved = useCallback(async () => {
    const responseSend = await sendMessage(messageUuid)
    if (responseSend === 'OK') {
      navigate(`../../${paths.confirmation}`)
    } else {
      // TODO: error management
    }
  }, [messageUuid, navigate])
  const [loadingSendButton, , launchAreFilterSaved] = useRetry(
    messageSynchronizationStatus,
    retryInterval,
    maxAttempts,
    sendMessageAfterFilterAreSaved
  )

  const defaultFilter = useMemo(() => ({ zone: currentScope.zones[0], resetFilter }), [currentScope, resetFilter])

  const handleFiltersSubmit = useCallback(
    async filtersToSend => {
      const filterWithZoneId = { ...filtersToSend, zone: filtersToSend.zone.uuid }
      try {
        if (audienceId) {
          await updateSegmentAudience(audienceId, { filter: { ...{ scope: currentScope.code }, ...filterWithZoneId } })
          launch(audienceId)
        } else {
          const audience = await createSegmentAudience({
            filter: { ...{ scope: currentScope.code }, ...filterWithZoneId },
          })
          setAudienceId(audience.uuid)
          launch(audience.uuid)
        }
      } catch (error) {
        setErrorMessage(error)
      }
    },
    [audienceId, currentScope.code, launch]
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
      launchAreFilterSaved(messageUuid)
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
        <Grid container>{errorMessage && <ErrorComponent errorMessage={errorMessage} />}</Grid>
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
            <Grid item xs={12} className={classes.messageContainer}>
              {audienceSegment && (
                <div className={classes.message}>
                  {messages.addresseesCount}&nbsp;
                  <span className={classes.addresseesCount}>{audienceSegment.recipient_count || 0} </span>
                  {pluralize(audienceSegment.recipient_count, messages.contact)}
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
              disabled={!audienceSegment?.synchronized || audienceSegment?.recipient_count < 1}
            >
              <Box className={classes.buttonIcon}>{loadingTestButton && <Loader />}</Box>
              {messages.testMessage}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              size="medium"
              className={classes.sendButton}
              disabled={!audienceSegment?.synchronized || audienceSegment?.recipient_count < 1 || loadingSendButton}
              onClick={() => setOpen(true)}
            >
              <Box className={classes.buttonIcon}>
                {loadingSendButton ? <Loader /> : <i className={`fa fa-paper-plane-o ${classes.buttonIcon}`} />}
              </Box>
              Envoyer l&apos;email
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
