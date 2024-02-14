import { Grid, Stack, TextField, Typography, InputAdornment, Box, CircularProgress } from '@mui/material'
import PropTypes from 'prop-types'
import { getMessages } from '~/api/messagerie'
import SentEmailCampaignsTitle from './SentEmailCampaignsTitle'
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'
import { useErrorHandler } from '~/components/shared/error/hooks'
import Loader from '~/ui/Loader'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getNextPageParam, usePaginatedData } from '~/api/pagination'
import { useScopedQueryKey } from '~/api/useQueryWithScope'

import { usePopover } from '~/mui/custom-popover'
import { useCallback, useRef, useState } from 'react'
import { Message } from '~/domain/message'

import { useDebounce } from '@uidotdev/usehooks'

import MessageCard from './MessageCard'
import ActionPopover from './ActionPopover'
import Iconify from '~/mui/iconify'

import { styled } from '@mui/system'

const AGrid = styled(Grid)`
  .item-enter {
    opacity: 0;
  }
  .item-enter-active {
    opacity: 1;
    transition: opacity 500ms ease-in;
  }
  .item-exit {
    opacity: 1;
  }
  .item-exit-active {
    opacity: 0;
    transition: opacity 500ms ease-in;
  }
`

import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { de } from 'date-fns/locale'

const messages = {
  noCampaign: 'Aucune campagne à afficher',
  noStatutoryMail: 'Aucun email statutaire à afficher',
  deleteSuccess: 'Brouillon supprimé avec succès',
}

interface SearchBoxProps {
  onPopoverOpen: (message: Message) => (...args: Parameters<typeof popover.onOpen>) => void
}

const SearchBox = (props: SearchBoxProps) => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const queryKey = useScopedQueryKey([
    'search-campaigns',
    { feature: 'Dashboard', view: 'SentEmailCampaigns' },
    debouncedSearch,
  ])
  const { handleError } = useErrorHandler()
  const { data, isFetching } = useQuery({
    queryFn: () => getMessages({ pagination: false, label: search }),
    queryKey: queryKey,
    onError: handleError,
    enabled: debouncedSearch.trim().length > 2,
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searc = e.target.value.trim()
    if (searc && searc.length > 2 && searc !== search) {
      setSearch(e.target.value)
    } else {
      setSearch('')
    }
  }

  const messages = search.trim().length > 2 ? data : []

  return (
    <Stack direction="column" gap={8} data-cy="sent-campaigns-container">
      <TextField
        id="input-with-icon-textfield"
        label="Rechercher"
        variant="outlined"
        color="secondary"
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-outline" color="grey.500" />
            </InputAdornment>
          ),
        }}
      />
      {!isFetching && messages && messages.length > 0 && (
        <Box display="flex" flexDirection="column" gap={2}>
          <AGrid container spacing={3}>
            <TransitionGroup component={null}>
              {messages.map(message => (
                <CSSTransition key={message.id} timeout={500} classNames="item">
                  <Grid item xs={12} sm={6} md={4} xl={3} data-cy="email-campaign-card">
                    <MessageCard message={message} onPopoverOpen={props.onPopoverOpen} />
                  </Grid>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </AGrid>
        </Box>
      )}

      {isFetching && (
        <Stack justifyContent="center" alignItems="center" height="10vh">
          <CircularProgress />
        </Stack>
      )}
    </Stack>
  )
}

const SentEmailCampaigns = ({ isMailsStatutory = false }) => {
  const { handleError } = useErrorHandler()
  const popover = usePopover()
  const currentMessage = useRef<Message | null>(null)
  const queryKey = useScopedQueryKey(['paginated-campaigns', { feature: 'Dashboard', view: 'SentEmailCampaigns' }])
  const queryKeyDrafts = useScopedQueryKey(['draft-campaigns', { feature: 'Dashboard', view: 'SentEmailCampaigns' }])
  const onPopoverOpen = useCallback(
    (message: Message) =>
      (...args: Parameters<typeof popover.onOpen>) => {
        currentMessage.current = message
        return popover.onOpen(...args)
      },
    [popover]
  )

  const { data: draftCampaigns = [] } = useQuery({
    queryFn: () => getMessages({ status: 'draft', pagination: false }),
    queryKey: queryKeyDrafts,
    onError: handleError,
  })

  const {
    data: paginatedCampaigns,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam: page = 1 }) =>
      getMessages({ statutory: isMailsStatutory, pagination: true, page, page_size: 20, status: 'sent' }),
    getNextPageParam,
    onError: handleError,
  })

  const campaigns = usePaginatedData(paginatedCampaigns)

  if (isLoading) {
    return <Loader isCenter />
  }
  if (!campaigns.length && !draftCampaigns.length) {
    return <div>{isMailsStatutory ? messages.noStatutoryMail : messages.noCampaign}</div>
  }

  return (
    <Stack direction="column" gap={8} data-cy="sent-campaigns-container">
      <SearchBox onPopoverOpen={onPopoverOpen} />
      {draftCampaigns.length > 0 && (
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="h6">Brouillions</Typography>
          <AGrid container spacing={3}>
            <TransitionGroup component={null}>
              {draftCampaigns.map(message => (
                <CSSTransition key={message.id} timeout={500} classNames="item">
                  <Grid item xs={12} sm={6} md={4} xl={3} data-cy="email-campaign-card">
                    <MessageCard message={message} onPopoverOpen={onPopoverOpen} />
                  </Grid>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </AGrid>
        </Box>
      )}
      <Box>
        <SentEmailCampaignsTitle isMailsStatutory={isMailsStatutory} />
        <InfiniteScroll dataLength={campaigns.length} next={fetchNextPage} hasMore={!!hasNextPage} loader={<Loader />}>
          <Grid container spacing={3}>
            <TransitionGroup component={null}>
              {campaigns.map(message => (
                <CSSTransition key={message.id} timeout={500} classNames="item">
                  <Grid item key={message.id} xs={12} sm={6} md={4} xl={3} data-cy="email-campaign-card">
                    <MessageCard message={message} onPopoverOpen={onPopoverOpen} />
                  </Grid>
                </CSSTransition>
              ))}
            </TransitionGroup>
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
