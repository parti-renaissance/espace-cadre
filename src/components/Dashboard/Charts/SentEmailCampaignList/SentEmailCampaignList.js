import { Grid, Typography } from '@mui/material'
import { deleteMessage, getMessages } from 'api/messagerie'
import SentEmailCampaignListTitle from './SentEmailCampaignListTitle'
import UICard from 'ui/Card'
import { Header } from './card/Header'
import Body from 'components/Dashboard/Charts/SentEmailCampaignList/card/Body'
import Actions from 'components/Dashboard/Charts/SentEmailCampaignList/card/Actions'
import { useInfiniteQuery, useMutation } from 'react-query'
import { useErrorHandler } from 'components/shared/error/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import Loader from 'ui/Loader'
import InfiniteScroll from 'react-infinite-scroll-component'
import { refetchUpdatedPage, getNextPageParam, usePaginatedData } from 'api/pagination'
import { TruncatedText, VerticalContainer } from 'components/shared/styled'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'

const messages = {
  nocampaign: 'Aucune campagne à afficher',
  deleteSuccess: 'Brouillon supprimé avec succès',
}

const TruncatedText3Lines = styled(TruncatedText)`
  color: ${({ theme }) => theme.palette.gray900};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  white-space: normal;
`

const Title = ({ subject, author }) => (
  <VerticalContainer sx={{ pt: 1 }}>
    <TruncatedText3Lines variant="subtitle1" title={subject}>
      {subject}
    </TruncatedText3Lines>
    <Typography variant="subtitle2" sx={{ color: 'gray600' }}>
      {author}
    </Typography>
  </VerticalContainer>
)
Title.propTypes = {
  subject: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
}

const EmptyBlock = () => <div />

const SentEmailCampaignList = () => {
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()

  const {
    data: paginatedCampaigns = null,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetching,
  } = useInfiniteQuery('messages', getMessages, {
    getNextPageParam,
    onError: handleError,
  })

  const campaigns = usePaginatedData(paginatedCampaigns)

  const { mutateAsync: deleteDraft, isLoading: isDeleteLoading } = useMutation(deleteMessage, {
    onSuccess: async (_, draftId) => {
      await refetchUpdatedPage(paginatedCampaigns, refetch, draftId)
      enqueueSnackbar(messages.deleteSuccess, notifyVariants.success)
    },
    onError: handleError,
  })

  return (
    <>
      <SentEmailCampaignListTitle />
      {paginatedCampaigns && (
        <InfiniteScroll
          dataLength={campaigns.length}
          next={() => fetchNextPage()}
          hasMore={hasNextPage}
          loader={<Loader />}
        >
          <Grid container spacing={2}>
            {campaigns.map(message => (
              <Grid item key={message.id} xs={12} sm={6} md={3} lg={3} xl={3}>
                <UICard
                  rootProps={{ sx: { height: '210px', justifyContent: 'space-between' } }}
                  headerProps={{ sx: { pt: '21px' } }}
                  header={
                    <>
                      <Header createdAt={message.createdAt} draft={message.draft} />
                      <Title subject={message.subject} author={message.author} />
                    </>
                  }
                  content={message.draft ? null : <Body statistics={message.statistics} />}
                  actionsProps={{ sx: { pb: 1, height: '40px' } }}
                  actions={
                    message.draft ? (
                      <Actions messageId={message.id} del={() => deleteDraft(message.id)} loader={isDeleteLoading} />
                    ) : (
                      <EmptyBlock />
                    )
                  }
                />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      )}
      {isFetching && <Loader />}
    </>
  )
}

export default SentEmailCampaignList
