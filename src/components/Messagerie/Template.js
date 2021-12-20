import { useState } from 'react'
import { Box, Grid, TextField } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useNavigate, useParams } from 'react-router-dom'
import { useUserScope } from '../../redux/user/hooks'
import { notifyVariants, notifyMessages } from '../shared/notification/constants'
import { useCustomSnackbar } from '../shared/notification/hooks'
import Editor from './Component/Editor'
import StepButton from './Component/StepButton'
import { createMessageContent, updateMessageContent } from 'api/messagerie'
import PropTypes from 'prop-types'
import paths from 'components/Messagerie/shared/paths'
import * as Sentry from '@sentry/react'

const clearBody = body => body.substring(body.indexOf('<table'), body.lastIndexOf('</table>') + 8)

const useStyles = makeStyles(theme => ({
  pageTitle: {
    fontSize: '24px',
    fontWeight: '400',
    color: theme.palette.blue600,
    marginBottom: theme.spacing(2),
  },
  objectContainer: {
    background: theme.palette.whiteCorner,
    padding: theme.spacing(2),
    borderRadius: '12px 12px 0 0',
  },
  mailObject: {
    width: '100%',
  },
  buttonContainer: {
    justifyContent: 'spaceBetween',
    marginRight: theme.spacing(2),
  },
}))

const messages = {
  createSuccess: 'Message créé avec succès',
  updateSuccess: 'Message modifié avec succès',
}

const Template = ({ modeUpdate = false }) => {
  const [messageSubject, setMessageSubject] = useState('')
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentScope] = useUserScope()
  const navigate = useNavigate()
  const { messageUuid } = useParams()
  const classes = useStyles()
  const { enqueueSnackbar } = useCustomSnackbar()

  const editEmail = () => {
    const body = {
      type: currentScope.code,
      label: `DataCorner: ${messageSubject}`,
      subject: messageSubject,
      content: clearBody(message.chunks.body),
      json_content: JSON.stringify(message.design),
    }

    if (messageUuid) return updateMessageContent(messageUuid, body)
    return createMessageContent(body)
  }

  const handleClickNext = async () => {
    try {
      setLoading(true)
      const body = await editEmail()
      setMessage(body)
      enqueueSnackbar(modeUpdate ? messages.updateSuccess : messages.createSuccess, notifyVariants.success)
      modeUpdate ? navigate(`../${paths.filter}`) : navigate(`../${body.uuid}/${paths.filter}`)
    } catch (e) {
      Sentry.captureException(e)
      enqueueSnackbar(notifyMessages.errorTitle, notifyVariants.error)
    }
  }

  return (
    <>
      <Box className={classes.pageTitle}>Messagerie &gt; Créer un message</Box>
      <Grid container className={classes.objectContainer}>
        <Grid item xs={4} className={classes.buttonContainer}>
          <TextField
            size="small"
            label="Objet du mail"
            variant="outlined"
            className={classes.mailObject}
            value={messageSubject}
            onChange={event => setMessageSubject(event.target.value)}
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
      </Grid>
      <Editor onMessageSubject={setMessageSubject} onMessageUpdate={setMessage} />
    </>
  )
}

export default Template

Template.propTypes = {
  modeUpdate: PropTypes.bool,
}
