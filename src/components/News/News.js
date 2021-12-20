import { useState, useCallback } from 'react'
import { Container, Grid, Button as MuiButton } from '@mui/material'
import { styled } from '@mui/system'
import { useInfiniteQuery, useMutation } from 'react-query'
import { getNewsQuery, updateNewsStatusQuery } from 'api/news'
import { useErrorHandler } from 'components/shared/error/hooks'
import PageTitle from 'ui/PageTitle'
import Header from './Card/Header'
import NewsDomain from 'domain/news'
import CreateEditModal from './CreateEditModal'
import ReadModal from './ReadModal'
import AddIcon from '@mui/icons-material/Add'
import UICard, { Title } from 'ui/Card'
import Actions from './Card/Actions'
import Loader from 'ui/Loader'
import InfiniteScroll from 'react-infinite-scroll-component'
import { usePaginatedData, getNextPageParam, refetchUpdatedPage } from 'api/pagination'
import { notifyVariants } from 'components/shared/notification/constants'
import { useCustomSnackbar } from 'components/shared/notification/hooks'

const Button = styled(MuiButton)(
  ({ theme }) => `
  color: ${theme.palette.orange500};
  background: ${theme.palette.newsBackground};
  border-radius: 8.35px;
`
)

const messages = {
  title: 'Actualités',
  create: 'Nouvelle Actualité',
  toggleSuccess: "L'actualité a bien été modifiée",
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
    isFetching,
  } = useInfiniteQuery('news', getNewsQuery, {
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
      await updateNewsStatus(toggledNews)
    },
    [news, updateNewsStatus]
  )

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <Grid item>
          <PageTitle title={messages.title} />
        </Grid>
        <Grid item>
          <Button onClick={handleNewsCreate}>
            <AddIcon sx={{ mr: 1 }} />
            {messages.create}
          </Button>
        </Grid>
      </Grid>
      {paginatedNews && (
        <InfiniteScroll dataLength={news.length} next={() => fetchNextPage()} hasMore={hasNextPage} loader={<></>}>
          <Grid container spacing={2}>
            {news.map(n => (
              <Grid item key={n.id} xs={12} sm={6} md={3}>
                <UICard
                  rootProps={{ sx: { height: '175px', borderRadius: '8px' } }}
                  headerProps={{ sx: { pt: '21px' } }}
                  header={
                    <>
                      <Header {...n} />
                      <Title subject={n.title} author={`Par ${n.creator}`} sx={{ pt: 1 }} />
                    </>
                  }
                  actionsProps={{ sx: { pt: 3 } }}
                  actions={
                    <Actions
                      toggleStatus={() => toggleNewsStatus(n.id)}
                      onView={handleView(n.id)}
                      status={n.status}
                      loader={isToggleStatusLoading}
                    />
                  }
                />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      )}
      {isFetching && <Loader />}
      <CreateEditModal
        open={isCreateEditModalOpen}
        news={viewingNews}
        onCloseResolve={handleClose}
        onSubmitResolve={refetch}
      />
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
