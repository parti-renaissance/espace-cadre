import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { deleteMessage, getMessages } from 'api/messagerie'
import SentEmailCampaignListTitle from './SentEmailCampaignListTitle'
import UIContainer from 'ui/Container'
import UICard, { Title } from 'ui/Card'
import { Header } from './card/Header'
import Body from 'components/Dashboard/Charts/SentEmailCampaignList/card/Body'
import Actions from 'components/Dashboard/Charts/SentEmailCampaignList/card/Actions'
import { useMutation, useQuery } from 'react-query'
import { useErrorHandler } from 'components/shared/error/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import Loader from 'ui/Loader'

const useStyles = makeStyles(theme => ({
  noData: {
    textAlign: 'center',
    padding: theme.spacing(0.75),
  },
}))

const messages = {
  nocampaign: 'Aucune campagne à afficher',
  deleteSuccess: 'Brouillon supprimé avec succès',
}

const SentEmailCampaignList = () => {
  const classes = useStyles()
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()

  const {
    data: emailCampaignReports = null,
    refetch,
    isLoading,
  } = useQuery('messages', getMessages, { onError: handleError })
  const { mutate: deleteDraft } = useMutation(deleteMessage, {
    onSuccess: () => {
      refetch()
      enqueueSnackbar(messages.deleteSuccess, notifyVariants.success)
    },
    onError: handleError,
  })

  const noCampaign = !emailCampaignReports || emailCampaignReports.data.length === 0

  if (noCampaign) {
    return (
      <>
        <SentEmailCampaignListTitle />
        <UIContainer rootClasses={classes.noData}>{isLoading ? <Loader /> : messages.nocampaign}</UIContainer>
      </>
    )
  }

  return (
    <>
      <SentEmailCampaignListTitle />
      <Grid container spacing={2}>
        {emailCampaignReports.data.map(message => (
          <Grid item key={message.id} xs={12} sm={6} md={3} lg={3} xl={3}>
            <UICard
              rootProps={{ sx: { height: '245px' } }}
              headerProps={{ sx: { pt: '21px' } }}
              header={
                <>
                  <Header createdAt={message.createdAt} draft={message.draft} />
                  <Title subject={message.subject} author={message.author} sx={{ pt: 1 }} />
                </>
              }
              contentProps={{ sx: { pt: 2 } }}
              content={message.draft && <Body statistics={message.statistics} />}
              actionsProps={{ sx: { pt: 3 } }}
              actions={message.draft && <Actions messageId={message.id} del={() => deleteDraft(message.id)} />}
            />
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default SentEmailCampaignList
