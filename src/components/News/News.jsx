import { useCallback, useMemo, useState } from 'react'
import { Container, Grid, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroll-component'

import { getNewsQuery, updateNewsPinnedStatusQuery } from '~/api/news'
import { useErrorHandler } from '~/components/shared/error/hooks'
import NewsDomain from '~/domain/news'
import CreateEditModal from './CreateEditModal'
import ReadModal from './ReadModal'
import Loader from '~/ui/Loader'
import { getNextPageParam, refetchUpdatedPage, usePaginatedData } from '~/api/pagination'
import { notifyVariants } from '~/components/shared/notification/constants'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { PageHeaderButton } from '~/ui/PageHeader/PageHeader'
import PageHeader from '~/ui/PageHeader'
import { useInfiniteQueryWithScope } from '~/api/useQueryWithScope'
import NewsAlert from '../shared/alert/NewsAlert'
import PinnedImage from '~/assets/pinned.svg'
import NewsList from './NewsList'

const messages = {
  title: 'Notifications',
  create: 'Nouvelle Notification',
  pinnedSubtitle: 'Épinglée dans l’application mobile',
  defaultSubtitle: 'Dans votre territoire',
  toggleSuccess: 'La notification a bien été modifiée',
  alertTitle: '🎉 NOUVEAU',
  alertText:
    'Vous pouvez épingler une seule des notifications de votre territoire pour que celle-ci apparaisse toujours en premier dans la section Notifications de l’application mobile.',
  noNews: 'Aucune notification à afficher',
}

const News = () => {
  const [viewingNews, setViewingNews] = useState(NewsDomain.NULL)
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [isReadModalOpen, setIsReadModalOpen] = useState(false)
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError } = useErrorHandler()

  const {
    data: paginatedNews = null,
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading: isNewsLoading,
  } = useInfiniteQueryWithScope(['paginated-news', { feature: 'News', view: 'News' }], getNewsQuery, {
    getNextPageParam,
    onError: handleError,
  })

  const news = usePaginatedData(paginatedNews)

  const { mutateAsync: updateNewsStatus, isLoading: isToggleStatusLoading } = useMutation(updateNewsPinnedStatusQuery, {
    onSuccess: async (_, updatedNews) => {
      await refetchUpdatedPage(paginatedNews, refetch, updatedNews.id)
      enqueueSnackbar(messages.toggleSuccess, notifyVariants.success)
    },
    onError: handleError,
  })

  const handleNewsCreate = () => {
    setViewingNews(NewsDomain.NULL)
    setIsCreateEditModalOpen(true)
  }

  const handleView = id => () => {
    setViewingNews(news.find(n => n.id === id) || NewsDomain.NULL)
    setIsReadModalOpen(true)
  }

  const handleEdit = id => () => {
    setViewingNews(news.find(n => n.id === id) || NewsDomain.NULL)
    setIsReadModalOpen(false)
    setIsCreateEditModalOpen(true)
  }

  const handleClose = () => {
    setViewingNews(NewsDomain.NULL)
    setIsCreateEditModalOpen(false)
    setIsReadModalOpen(false)
  }

  const toggleNewsStatus = useCallback(
    async id => {
      const currentNews = news.find(n => n.id === id)
      const toggledNews = currentNews.toggleStatus()
      if (!toggledNews.status && toggledNews.pinned) {
        toggledNews.pinned = false
      }
      await updateNewsStatus(toggledNews)
    },
    [news, updateNewsStatus]
  )

  const toggleNewsPinned = useCallback(
    async id => {
      const currentNews = news.find(n => n.id === id)
      const toggledNews = currentNews.togglePinned()
      if (!toggledNews.status && toggledNews.pinned) {
        toggledNews.status = true
      }
      await updateNewsStatus(toggledNews)
    },
    [news, updateNewsStatus]
  )

  const pinnedNews = useMemo(() => news.filter(item => item.pinned), [news])
  const unpinnedNews = useMemo(() => news.filter(item => !item.pinned), [news])

  const shouldDisplayPinned = pinnedNews.length > 0
  const shouldDisplayDefaultHeader = pinnedNews.length === 0

  return (
    <Container maxWidth={false} sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={<PageHeaderButton onClick={handleNewsCreate} label={messages.create} isMainButton />}
        />
      </Grid>
      {isNewsLoading ? (
        <Loader isCenter />
      ) : (
        <InfiniteScroll dataLength={news.length} next={() => fetchNextPage()} hasMore={hasNextPage} loader={<Loader />}>
          {shouldDisplayPinned && (
            <Grid sx={{ mb: 2 }}>
              <Typography sx={{ color: 'gray800', fontSize: '18px', lineHeight: '27px' }}>
                {messages.pinnedSubtitle}
              </Typography>
              <NewsList
                data={pinnedNews}
                toggleNewsStatus={toggleNewsStatus}
                toggleNewsPinned={toggleNewsPinned}
                handleEdit={handleEdit}
                handleView={handleView}
                isToggleStatusLoading={isToggleStatusLoading}
              />
            </Grid>
          )}
          {shouldDisplayDefaultHeader && (
            <Grid>
              <Typography component="div" sx={{ mb: 2, color: 'gray800', fontSize: '18px', lineHeight: '27px' }}>
                {messages.pinnedSubtitle}
              </Typography>
              <NewsAlert title={messages.alertTitle} content={messages.alertText} image={PinnedImage} />
            </Grid>
          )}
          <Grid>
            <Typography sx={{ color: 'gray800', fontSize: '18px', lineHeight: '27px' }}>
              {messages.defaultSubtitle}
            </Typography>
            {news.length ? (
              <NewsList
                data={unpinnedNews}
                toggleNewsStatus={toggleNewsStatus}
                toggleNewsPinned={toggleNewsPinned}
                handleEdit={handleEdit}
                handleView={handleView}
                isToggleStatusLoading={isToggleStatusLoading}
              />
            ) : (
              <Grid sx={{ mt: 2 }}>{messages.noNews}</Grid>
            )}
          </Grid>
        </InfiniteScroll>
      )}
      {isCreateEditModalOpen && (
        <CreateEditModal open news={viewingNews} onCloseResolve={handleClose} onSubmitResolve={refetch} />
      )}
      <ReadModal
        open={isReadModalOpen}
        news={viewingNews}
        handleEdit={handleEdit(viewingNews?.id)}
        onCloseResolve={handleClose}
      />
    </Container>
  )
}

export default News
