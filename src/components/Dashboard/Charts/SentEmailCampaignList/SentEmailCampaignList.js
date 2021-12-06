import { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { getMessages } from 'api/messagerie'
import SentEmailCampaignListTitle from './SentEmailCampaignListTitle'
import UIContainer from 'ui/Container'
import UICard from 'ui/Card'
import { Header, Title } from './card/Header'
import Body from 'components/Dashboard/Charts/SentEmailCampaignList/card/Body'
import Actions from 'components/Dashboard/Charts/SentEmailCampaignList/card/Actions'

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
          <Grid item key={message.id} lg={3} xl={3} sx={{ flexGrow: 1 }}>
            <UICard
              headerTitle={<Header createdAt={message.createdAt} draft={message.draft} />}
              headerSubtitle={<Title subject={message.subject} author={message.author} />}
              content={message.draft ? null : <Body statistics={message.statistics} />}
              actions={message.draft ? <Actions messageId={message.id} /> : null}
            />
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default SentEmailCampaignList
