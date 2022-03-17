import { useState, useCallback } from 'react'
import { Container, Grid, Typography } from '@mui/material'

import { useMutation } from 'react-query'
import { getNewsQuery, updateNewsStatusQuery, updateNewsPinnedQuery } from 'api/news'
import { useErrorHandler } from 'components/shared/error/hooks'
import Header from './Card/Header'
import NewsDomain from 'domain/news'
import CreateEditModal from './CreateEditModal'
import ReadModal from './ReadModal'
import UICard, { Title } from 'ui/Card'
import Actions from './Card/Actions'
import Loader from 'ui/Loader'
import InfiniteScroll from 'react-infinite-scroll-component'
import { usePaginatedData, getNextPageParam, refetchUpdatedPage } from 'api/pagination'
import { notifyVariants } from 'components/shared/notification/constants'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useCurrentDeviceType } from 'components/shared/device/hooks'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import PageHeader from 'ui/PageHeader'
import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import NewsAlert from '../shared/alert/NewsAlert'
import PinnedImage from 'assets/pinned.svg'

const messages = {
  title: 'Actualités',
  create: 'Nouvelle Actualité',
  pinnedSubtitle: 'Épinglée dans l’application Je m’engage',
  defaultSubtitle: 'Dans votre territoire',
  toggleSuccess: "L'actualité a bien été modifiée",
  alertTitle: '🎉 NOUVEAU',
  alertText:
    'Vous pouvez épingler une seule des actualités de votre territoire pour que celle-ci apparaisse toujours en premier dans la section Actualités de l’application mobile.',
}

const News = () => {
  const [viewingNews, setViewingNews] = useState(NewsDomain.NULL)
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [isReadModalOpen, setIsReadModalOpen] = useState(false)
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError } = useErrorHandler()
  const { isMobile } = useCurrentDeviceType()

  const {
    data: paginatedNews = null,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQueryWithScope(['paginated-news', { feature: 'News', view: 'News' }], getNewsQuery, {
    getNextPageParam,
    onError: handleError,
  })

  const news = usePaginatedData(paginatedNews)

  const { mutateAsync: updateNewsStatus, isLoading: isToggleStatusLoading } = useMutation(updateNewsStatusQuery, {
    onSuccess: async (_, updatedNews) => {
      await refetchUpdatedPage(paginatedNews, refetch, updatedNews.id)
      enqueueSnackbar(messages.toggleSuccess, notifyVariants.success)
    },
    onError: handleError,
  })

  const { mutateAsync: updateNewsPinned, isLoading: isTogglePinnedLoading } = useMutation(updateNewsPinnedQuery, {
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
      await updateNewsPinned(toggledNews)
    },
    [news, updateNewsPinned]
  )

  const pinnedNews = news.filter(item => item.pinned)
  const unpinnedNews = news.filter(item => !item.pinned)
  const shouldDisplayPinned = pinnedNews.length > 0
  const shouldDisplayDefaultHeader = pinnedNews.length === 0

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={<PageHeaderButton onClick={handleNewsCreate} label={messages.create} isMainButton />}
        />
      </Grid>
      {paginatedNews && (
        <InfiniteScroll dataLength={news.length} next={() => fetchNextPage()} hasMore={hasNextPage} loader={<Loader />}>
          {shouldDisplayPinned && (
            <Grid sx={{ mb: 2 }}>
              <Typography sx={{ color: 'gray800', fontSize: '18px', lineHeight: '27px' }}>
                {messages.pinnedSubtitle}
              </Typography>

              <Grid container spacing={2} sx={{ mt: 0, ...(isMobile && { pt: 2 }) }}>
                {pinnedNews.map(n => (
                  <Grid item key={n.id} xs={12} sm={6} md={3}>
                    <UICard
                      rootProps={{ sx: { height: '180px', borderRadius: '8px' } }}
                      headerProps={{ sx: { pt: '21px' } }}
                      header={
                        <>
                          <Header {...n} />
                          <Title subject={n.title} author={n.creator} sx={{ pt: 1 }} dateTime={n.createdAt} />
                        </>
                      }
                      actionsProps={{ sx: { pt: 3 } }}
                      actions={
                        <Actions
                          toggleStatus={() => toggleNewsStatus(n.id)}
                          togglePinned={() => toggleNewsPinned(n.id)}
                          handleEdit={handleEdit(n.id)}
                          onView={handleView(n.id)}
                          status={n.status}
                          pinned={n.pinned}
                          statusLoader={isToggleStatusLoading}
                          pinnedLoader={isTogglePinnedLoading}
                        />
                      }
                    />
                  </Grid>
                ))}
              </Grid>
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
            <Grid container spacing={2} sx={{ mt: 1, ...(isMobile && { pt: 2 }) }}>
              {unpinnedNews.map(n => (
                <Grid item key={n.id} xs={12} sm={6} md={3}>
                  <UICard
                    rootProps={{ sx: { height: '180px', borderRadius: '8px' } }}
                    headerProps={{ sx: { pt: '21px' } }}
                    header={
                      <>
                        <Header {...n} />
                        <Title subject={n.title} author={n.creator} sx={{ pt: 1 }} dateTime={n.createdAt} />
                      </>
                    }
                    actionsProps={{ sx: { pt: 3 } }}
                    actions={
                      <Actions
                        toggleStatus={() => toggleNewsStatus(n.id)}
                        togglePinned={() => toggleNewsPinned(n.id)}
                        handleEdit={handleEdit(n.id)}
                        onView={handleView(n.id)}
                        status={n.status}
                        pinned={n.pinned}
                        statusLoader={isToggleStatusLoading}
                        pinnedLoader={isTogglePinnedLoading}
                      />
                    }
                  />
                </Grid>
              ))}
            </Grid>
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
