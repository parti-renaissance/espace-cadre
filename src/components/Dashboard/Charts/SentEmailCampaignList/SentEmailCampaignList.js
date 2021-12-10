import { Grid } from '@mui/material'
import { deleteMessage, getMessages } from 'api/messagerie'
import SentEmailCampaignListTitle from './SentEmailCampaignListTitle'
import UICard, { Title } from 'ui/Card'
import { Header } from './card/Header'
import Body from 'components/Dashboard/Charts/SentEmailCampaignList/card/Body'
import Actions from 'components/Dashboard/Charts/SentEmailCampaignList/card/Actions'
import { useInfiniteQuery, useMutation } from 'react-query'
import { useErrorHandler } from 'components/shared/error/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import Loader from 'ui/Loader'
import InfiniteScroll from 'react-infinite-scroll-component'

const messages = {
  nocampaign: 'Aucune campagne à afficher',
  deleteSuccess: 'Brouillon supprimé avec succès',
}

const SentEmailCampaignList = () => {
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()

  const {
    data: paginatedCampaigns = null,
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading,
  } = useInfiniteQuery('messages', getMessages, {
    getNextPageParam: lastFetchedPage =>
      lastFetchedPage.currentPage < lastFetchedPage.lastPage ? lastFetchedPage.currentPage + 1 : undefined,
    onError: handleError,
  })

  const { mutate: deleteDraft } = useMutation(deleteMessage, {
    onSuccess: (_, draftId) => {
      const pageToReload = paginatedCampaigns.pages.find(p =>
        p.data.some(message => message.id === draftId)
      )?.currentPage
      refetch({
        refetchPage: (page, index) => index + 1 === pageToReload,
      })
      enqueueSnackbar(messages.deleteSuccess, notifyVariants.success)
    },
    onError: handleError,
  })

  return (
    <>
      <SentEmailCampaignListTitle />
      {isLoading && <Loader />}
      {paginatedCampaigns && (
        <InfiniteScroll
          dataLength={paginatedCampaigns.pages.flatMap(p => p.data).length}
          next={() => fetchNextPage()}
          hasMore={hasNextPage}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          <Grid container spacing={2}>
            {paginatedCampaigns.pages
              .flatMap(p => p.data)
              .map(message => (
                <Grid item key={message.id} xs={12} sm={6} md={3} lg={3} xl={3}>
                  <UICard
                    rootProps={{ sx: { height: '230px' } }}
                    headerProps={{ sx: { pt: '21px' } }}
                    header={
                      <>
                        <Header createdAt={message.createdAt} draft={message.draft} />
                        <Title subject={message.subject} author={message.author} sx={{ pt: 1 }} />
                      </>
                    }
                    contentProps={{ sx: { pt: 1 } }}
                    content={message.draft && <Body statistics={message.statistics} />}
                    actionsProps={{ sx: { pt: 3 } }}
                    actions={message.draft && <Actions messageId={message.id} del={() => deleteDraft(message.id)} />}
                  />
                </Grid>
              ))}
          </Grid>
        </InfiniteScroll>
      )}
    </>
  )
}

export default SentEmailCampaignList
