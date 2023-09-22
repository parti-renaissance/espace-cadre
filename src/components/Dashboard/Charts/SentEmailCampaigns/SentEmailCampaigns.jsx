import { Grid, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { deleteMessage, getMessages } from 'api/messagerie'
import SentEmailCampaignsTitle from './SentEmailCampaignsTitle'
import UICard from 'ui/Card'
import { Header } from './card/Header'
import Body from 'components/Dashboard/Charts/SentEmailCampaigns/card/Body'
import Actions from 'components/Dashboard/Charts/SentEmailCampaigns/card/Actions'
import { useMutation } from '@tanstack/react-query'
import { useErrorHandler } from 'components/shared/error/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import Loader from 'ui/Loader'
import InfiniteScroll from 'react-infinite-scroll-component'
import { refetchUpdatedPage, getNextPageParam, usePaginatedData } from 'api/pagination'
import { TruncatedText, VerticalContainer } from 'components/shared/styled'
import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'

const messages = {
  noCampaign: 'Aucune campagne à afficher',
  noStatutoryMail: 'Aucun mail statutaire à afficher',
  deleteSuccess: 'Brouillon supprimé avec succès',
}

const Title = ({ subject, author }) => (
  <VerticalContainer sx={{ pt: 1 }}>
    <TruncatedText variant="subtitle1" title={subject} lines={3} sx={{ color: 'gay900' }}>
      {subject}
    </TruncatedText>
    <Typography variant="subtitle2" sx={{ color: 'gray600' }}>
      {author}
    </Typography>
  </VerticalContainer>
)
Title.propTypes = {
  subject: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
}

const SentEmailCampaigns = ({ isMailsStatutory = false }) => {
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()

  const {
    data: paginatedCampaigns = null,
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading,
  } = useInfiniteQueryWithScope(
    ['paginated-campaigns', { feature: 'Dashboard', view: 'SentEmailCampaigns' }],
    ({ pageParam: page = 1 }) => getMessages({ isMailsStatutory, page }),
    {
      getNextPageParam,
      onError: handleError,
    }
  )

  const campaigns = usePaginatedData(paginatedCampaigns)

  const { mutateAsync: deleteDraft, isLoading: isDeleteLoading } = useMutation(deleteMessage, {
    onSuccess: async (_, draftId) => {
      await refetchUpdatedPage(paginatedCampaigns, refetch, draftId)
      enqueueSnackbar(messages.deleteSuccess, notifyVariants.success)
    },
    onError: handleError,
  })

  if (isLoading) {
    return <Loader isCenter />
  }

  if (!campaigns.length) {
    return <div>{isMailsStatutory ? messages.noStatutoryMail : messages.noCampaign}</div>
  }

  return (
    <div data-cy="sent-campaigns-container">
      <SentEmailCampaignsTitle isMailsStatutory={isMailsStatutory} />
      <InfiniteScroll
        dataLength={campaigns.length}
        next={() => fetchNextPage()}
        hasMore={hasNextPage}
        loader={<Loader />}
      >
        <Grid container spacing={2}>
          {campaigns.map(message => (
            <Grid item key={message.id} xs={12} sm={6} md={3} lg={3} xl={3} data-cy="email-campaign-card">
              <UICard
                rootProps={{ sx: { height: '210px', justifyContent: 'space-between' } }}
                headerProps={{ sx: { pt: '21px' } }}
                header={
                  <>
                    <Header createdAt={message.draft ? message.createdAt : message.sentAt} draft={message.draft} />
                    <Title subject={message.subject} author={message.author} />
                  </>
                }
                content={message.draft ? null : <Body statistics={message.statistics} />}
                actionsProps={{ sx: { pb: 1, height: '40px' } }}
                actions={
                  <Actions
                    messageId={message.id}
                    onDelete={() => deleteDraft(message.id)}
                    loader={isDeleteLoading}
                    isEditEnabled={!isMailsStatutory}
                    onPreview={
                      message.isSynchronized && message.previewLink
                        ? () => window.open(message.previewLink, '_blank')
                        : null
                    }
                  />
                }
              />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </div>
  )
}

export default SentEmailCampaigns

SentEmailCampaigns.propTypes = {
  isMailsStatutory: PropTypes.bool,
}
