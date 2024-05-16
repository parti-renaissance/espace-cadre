import { Box, CircularProgress, Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { getMessages } from '~/api/messagerie'
import SentEmailCampaignsTitle from './SentEmailCampaignsTitle'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useErrorHandler } from '~/components/shared/error/hooks'
import Loader from '~/ui/Loader'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getNextPageParam, usePaginatedData } from '~/api/pagination'
import { useScopedQueryKey } from '~/api/useQueryWithScope'

import { usePopover } from '~/mui/custom-popover'
import React, { useCallback, useRef, useState } from 'react'
import { Message } from '~/domain/message'

import { useDebounce } from '@uidotdev/usehooks'

import MessageCard from './MessageCard'
import ActionPopover from './ActionPopover'
import Iconify from '~/mui/iconify'

import { CSSTransition, TransitionGroup } from 'react-transition-group'
import AGrid from '~/components/AGrid/AGrid'

type OnPopoverOpen = (message: Message) => (...args: Parameters<ReturnType<typeof usePopover>['onOpen']>) => void

interface MessageListProps {
  onPopoverOpen: OnPopoverOpen
  isMailsStatutory: boolean
  messages: Message[]
}

const MessageList = (props: MessageListProps) => (
  <AGrid container spacing={3}>
    <TransitionGroup component={null}>
      {Array.isArray(props.messages) &&
        props.messages.map(message => (
          <CSSTransition key={message.id} timeout={500} classNames="item">
            <Grid item xs={12} sm={6} md={4} xl={3}>
              <MessageCard
                message={message}
                onPopoverOpen={props.onPopoverOpen}
                isMailsStatutory={props.isMailsStatutory}
              />
            </Grid>
          </CSSTransition>
        ))}
    </TransitionGroup>
  </AGrid>
)

const MessageLoader = () => (
  <Stack justifyContent="center" alignItems="center" height="10vh">
    <CircularProgress />
  </Stack>
)

const EmptyStatus = (props: { text: string }) => (
  <Stack justifyContent="center" alignItems="center" height="10vh">
    <Typography variant="subtitle2" textAlign="center">
      {props.text}
    </Typography>
  </Stack>
)

interface SearchBoxProps {
  onPopoverOpen: OnPopoverOpen
  isMailsStatutory: boolean
}

const SearchBox = (props: SearchBoxProps) => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const queryKey = useScopedQueryKey([
    'search-campaigns',
    { feature: 'Dashboard', view: 'SentEmailCampaigns' },
    props.isMailsStatutory ? 'statutory' : undefined,
    debouncedSearch,
  ])
  const { handleError } = useErrorHandler()
  const { data = [], isFetching } = useQuery({
    queryFn: () => getMessages({ pagination: false, label: search, statutory: props.isMailsStatutory }),
    queryKey: queryKey,
    onError: handleError,
    enabled: debouncedSearch.length > 2,
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.trim())
  }

  return (
    <Stack direction="column" gap={8}>
      <Grid container>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            id="input-with-icon-textfield"
            color="secondary"
            onChange={handleSearch}
            InputProps={{
              placeholder: 'Rechercher ...',
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-outline" color="grey.500" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      {!isFetching && data.length > 0 && (
        <Box display="flex" flexDirection="column" gap={2}>
          <MessageList messages={data} onPopoverOpen={props.onPopoverOpen} isMailsStatutory={props.isMailsStatutory} />
        </Box>
      )}

      {isFetching && <MessageLoader />}
    </Stack>
  )
}

const MessageDraftSection = (props: { onPopoverOpen: OnPopoverOpen; isMailsStatutory: boolean }) => {
  const queryKeyDrafts = useScopedQueryKey([
    'draft-campaigns',
    { feature: 'Dashboard', view: 'SentEmailCampaigns' },
    props.isMailsStatutory ? 'statutory' : undefined,
  ])
  const { handleError } = useErrorHandler()
  const {
    data = [],
    isInitialLoading,
    isFetched,
  } = useQuery({
    queryFn: () => getMessages({ status: 'draft', pagination: false, statutory: props.isMailsStatutory }),
    queryKey: queryKeyDrafts,
    onError: handleError,
  })

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h6">Brouillons</Typography>
      <MessageList messages={data} onPopoverOpen={props.onPopoverOpen} isMailsStatutory={props.isMailsStatutory} />
      {isInitialLoading && <MessageLoader />}
      {isFetched && data.length === 0 && <EmptyStatus text="0 brouillons" />}
    </Box>
  )
}

const MessageSentSection = (props: { onPopoverOpen: OnPopoverOpen; isMailsStatutory: boolean }) => {
  const queryKey = useScopedQueryKey([
    'paginated-campaigns',
    { feature: 'Dashboard', view: 'SentEmailCampaigns' },
    props.isMailsStatutory ? 'statutory' : undefined,
  ])
  const { handleError } = useErrorHandler()
  const { data, fetchNextPage, hasNextPage, isFetched, isInitialLoading } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam: page = 1 }) =>
      getMessages({ statutory: props.isMailsStatutory, page, page_size: 20, status: 'sent' }),
    getNextPageParam,
    onError: handleError,
  })

  const campaigns = usePaginatedData(data)

  return (
    <Box>
      <SentEmailCampaignsTitle isMailsStatutory={props.isMailsStatutory} />
      <InfiniteScroll
        dataLength={campaigns.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<Loader />}
        style={{
          overflow: 'visible',
        }}
      >
        <MessageList
          messages={campaigns}
          onPopoverOpen={props.onPopoverOpen}
          isMailsStatutory={props.isMailsStatutory}
        />
        {isInitialLoading && <MessageLoader />}
        {isFetched && campaigns.length === 0 && <EmptyStatus text="0 campagnes envoyées" />}
      </InfiniteScroll>
    </Box>
  )
}

const SentEmailCampaigns = ({ isMailsStatutory = false }) => {
  const popover = usePopover()
  const currentMessage = useRef<Message | null>(null)
  const onPopoverOpen = useCallback(
    (message: Message) =>
      (...args: Parameters<typeof popover.onOpen>) => {
        currentMessage.current = message
        return popover.onOpen(...args)
      },
    [popover]
  )

  return (
    <Stack direction="column" gap={8}>
      <SearchBox onPopoverOpen={onPopoverOpen} isMailsStatutory={isMailsStatutory} />
      <MessageDraftSection onPopoverOpen={onPopoverOpen} isMailsStatutory={isMailsStatutory} />
      <MessageSentSection onPopoverOpen={onPopoverOpen} isMailsStatutory={isMailsStatutory} />
      <ActionPopover popover={popover} isMailsStatutory={isMailsStatutory} message={currentMessage} />
    </Stack>
  )
}

export default SentEmailCampaigns

SentEmailCampaigns.propTypes = {
  isMailsStatutory: PropTypes.bool,
}
