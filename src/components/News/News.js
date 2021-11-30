import { useState, useEffect } from 'react'
import { Container, Grid, Button as MuiButton } from '@mui/material'
import { styled } from '@mui/system'
import AddIcon from '@mui/icons-material/Add'
import { getNews, updateNewsStatus } from 'api/news'
import PageTitle from 'ui/PageTitle'
import Card from 'ui/Card'
import Header from './Card/Header'
import Content from './Card/Content'
import NewsDomain from 'domain/news'
import CreateEditModal from './CreateEditModal'
import ReadModal from './ReadModal'

const Button = styled(MuiButton)(
  ({ theme }) => `
  color: ${theme.palette.orange500};
  background: ${theme.palette.newsBackground};
  border-radius: 8.35px;
`
)

const News = () => {
  const [news, setNews] = useState([])
  const [newNews, setNewNews] = useState(null)
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [isReadModalOpen, setIsReadModalOpen] = useState(false)

  const handleClick = id => () => {
    setNewNews(news.find(n => n.id === id) || null)
    setIsCreateEditModalOpen(false)
    setIsReadModalOpen(true)
  }

  const handleOpenEditModal = id => () => {
    setNewNews(news.find(n => n.id === id) || null)
    setIsCreateEditModalOpen(true)
    setIsReadModalOpen(false)
  }

  const toggleNewsStatus = async id => {
    const info = news.find(n => n.id === id)
    const editedNews = info.toggleStatus()
    setNews(prev =>
      prev
        .filter(n => n.id !== id)
        .concat(editedNews)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    )
    await updateNewsStatus(editedNews)
    getNews(setNews)
  }

  const handleNewNews = () => {
    setNewNews(NewsDomain.NULL)
    setIsCreateEditModalOpen(true)
    setIsReadModalOpen(false)
  }

  const handleClose = () => {
    setIsCreateEditModalOpen(false)
    setIsReadModalOpen(false)
  }

  const handleSubmitRefresh = () => {
    getNews(setNews)
  }

  useEffect(() => {
    getNews(setNews)
  }, [])

  const messages = {
    title: 'Actualités',
    create: 'Nouvelle Actualité',
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 2 }}>
      <Grid container justifyContent="space-between">
        <Grid item>
          <PageTitle title={messages.title} />
        </Grid>
        <Grid item>
          <Button onClick={handleNewNews}>
            <AddIcon sx={{ mr: 1 }} />
            {messages.create}
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {news.map(n => (
          <Card key={n.id} header={<Header {...n} />} title={n.title} subtitle={`Par ${n.creator}`}>
            <Content news={n} handleClick={handleClick(n.id)} toggleStatus={toggleNewsStatus} />
          </Card>
        ))}
      </Grid>
      <CreateEditModal
        open={isCreateEditModalOpen}
        handleClose={handleClose}
        news={newNews}
        onSubmitRefresh={handleSubmitRefresh}
      />
      <ReadModal
        open={isReadModalOpen}
        handleClose={handleClose}
        news={newNews}
        onSubmitRefresh={handleSubmitRefresh}
        handleOpenEditModal={handleOpenEditModal(newNews?.id)}
      />
    </Container>
  )
}

export default News
