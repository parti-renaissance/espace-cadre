import { useState } from 'react'
import { Box, Grid, TextField } from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { generatePath, useHistory, useParams } from 'react-router-dom'
import { useUserScope } from '../../redux/user/hooks'
import Editor from './Component/Editor'
import StepButton from './Component/StepButton'
import TemplateSelect from './Component/TemplateSelect'
import PATHS from '../../paths'
import { createMessage, updateMessage } from 'api/messagerie'

const clearBody = body => body.substring(body.indexOf('<table'), body.lastIndexOf('</table>') + 8)

const useStyles = makeStyles(theme =>
  createStyles({
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
      border: `1px solid ${theme.palette.gray200}`,
      borderRadius: '8.35px',
    },
    buttonContainer: {
      justifyContent: 'spaceBetween',
      marginRight: theme.spacing(2),
    },
    templateContainer: {
      marginRight: theme.spacing(2),
    },
  })
)

const Template = () => {
  const [messageSubject, setMessageSubject] = useState('')
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentScope] = useUserScope()
  const history = useHistory()
  const { messageUuid } = useParams()
  const classes = useStyles()

  const editEmail = () => {
    const body = {
      type: currentScope.code,
      label: `DataCorner: ${messageSubject}`,
      subject: messageSubject,
      content: clearBody(message.chunks.body),
      json_content: JSON.stringify(message.design),
    }

    if (messageUuid) {
      return updateMessage(messageUuid, body)
    }
    return createMessage(body)
  }

  const handleClickNext = () => {
    setLoading(true)
    editEmail().then(body => {
      setMessage(body)
      history.push(generatePath(PATHS.MESSAGERIE_FILTER.url, { messageUuid: body.uuid }))
    })
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
        <Grid item xs={5} className={classes.templateContainer}>
          <TemplateSelect />
        </Grid>
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
