import { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { getMessages } from 'api/messagerie'
import SentEmailCampaignListTitle from './SentEmailCampaignListTitle'
import UIContainer from 'ui/Container'
import UICard from 'ui/Card'
import Header from './card/Header'
import Body from './card/Body'
import { generatePath, useNavigate } from 'react-router-dom'
import paths from 'components/Messagerie/shared/paths'

const useStyles = makeStyles(theme => ({
  noData: {
    textAlign: 'center',
    padding: theme.spacing(0.75),
  },
}))

const messages = {
  nocampaign: 'Aucune campagne à afficher',
}

const SentEmailCampaignList = () => {
  const classes = useStyles()
  const [emailCampaignReports, setEmailCampaignReports] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getEmailCampaignReports = async () => {
      try {
        await getMessages(setEmailCampaignReports)
      } catch (error) {
        // TODO snackbar
      }
    }
    getEmailCampaignReports()
  }, [])

  const handleClick = messageId => {
    navigate(generatePath(':messageId/' + paths.update, { messageId }))
  }

  const noCampaign = !emailCampaignReports || emailCampaignReports.data.length === 0

  if (noCampaign) {
    return (
      <>
        <SentEmailCampaignListTitle />
        <UIContainer rootClasses={classes.noData}>{messages.nocampaign}</UIContainer>
      </>
    )
  }

  return (
    <>
      <SentEmailCampaignListTitle />
      <Grid container spacing={2}>
        {emailCampaignReports.data.map(message => (
          <UICard
            key={message.id}
            header={<Header createdAt={message.createdAt} draft={message.draft} />}
            title={message.subject}
            subtitle={`Par ${message.author}`}
          >
            <Body statistics={message.statistics} handleClick={() => handleClick(message.id)} />
          </UICard>
        ))}
      </Grid>
    </>
  )
}

export default SentEmailCampaignList
