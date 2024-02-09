import { Grid, Stack, TextField, Typography, InputAdornment } from '@mui/material'
import PropTypes from 'prop-types'
import { getMessages } from '~/api/messagerie'
import SentEmailCampaignsTitle from './SentEmailCampaignsTitle'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useErrorHandler } from '~/components/shared/error/hooks'
import Loader from '~/ui/Loader'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getNextPageParam, usePaginatedData } from '~/api/pagination'
import { useScopedQueryKey } from '~/api/useQueryWithScope'

import { usePopover } from '~/mui/custom-popover'
import { useCallback, useRef } from 'react'
import { Message } from '~/domain/message'

import MessageCard from './MessageCard'
import ActionPopover from './ActionPopover'
import { Box } from '@mui/system'
import Iconify from '~/mui/iconify'

const messages = {
  noCampaign: 'Aucune campagne à afficher',
  noStatutoryMail: 'Aucun email statutaire à afficher',
  deleteSuccess: 'Brouillon supprimé avec succès',
}

const SentEmailCampaigns = ({ isMailsStatutory = false }) => {
  const { handleError } = useErrorHandler()
  const popover = usePopover()
  const currentMessage = useRef<Message | null>(null)
  const queryKey = useScopedQueryKey(['paginated-campaigns', { feature: 'Dashboard', view: 'SentEmailCampaigns' }])
  const onPopoverOpen = useCallback(
    (message: Message) =>
      (...args: Parameters<typeof popover.onOpen>) => {
        currentMessage.current = message
        return popover.onOpen(...args)
      },
    [popover]
  )

  const {
    data: paginatedCampaigns = null,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery<{ data: Message[] }>(
    queryKey,
    ({ pageParam: page = 1 }) => getMessages({ isMailsStatutory, page }),
    {
      getNextPageParam,
      onError: handleError,
    }
  )

  const campaigns = usePaginatedData(paginatedCampaigns) as Message[]

  const drafts = campaigns.filter(message => message.draft)
  const sents = campaigns.filter(message => !message.draft)

  if (isLoading) {
    return <Loader isCenter />
  }
  if (!campaigns.length) {
    return <div>{isMailsStatutory ? messages.noStatutoryMail : messages.noCampaign}</div>
  }

  return (
    <Stack direction="column" gap={8} data-cy="sent-campaigns-container">
      <TextField
        id="input-with-icon-textfield"
        label="Rechercher"
        variant="outlined"
        color="secondary"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-outline" color="grey.500" />
            </InputAdornment>
          ),
        }}
      />
      {drafts.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Brouillions
          </Typography>
          <Grid container spacing={3}>
            {drafts.map(message => (
              <Grid item key={message.id} xs={12} sm={6} md={4} xl={3} data-cy="email-campaign-card">
                <MessageCard message={message} onPopoverOpen={onPopoverOpen} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      <Box>
        <SentEmailCampaignsTitle isMailsStatutory={isMailsStatutory} />
        <InfiniteScroll dataLength={sents.length} next={fetchNextPage} hasMore={!!hasNextPage} loader={<Loader />}>
          <Grid container spacing={3}>
            {sents.map(message => (
              <Grid item key={message.id} xs={12} sm={6} md={4} xl={3} data-cy="email-campaign-card">
                <MessageCard message={message} onPopoverOpen={onPopoverOpen} />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      </Box>
      <ActionPopover popover={popover} isMailsStatutory={isMailsStatutory} message={currentMessage} />
    </Stack>
  )
}

export default SentEmailCampaigns

SentEmailCampaigns.propTypes = {
  isMailsStatutory: PropTypes.bool,
}
