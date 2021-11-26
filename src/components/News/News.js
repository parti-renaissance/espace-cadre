import { useState, useEffect } from 'react'
import { Container, Grid, Button as MuiButton } from '@mui/material'
import { styled } from '@mui/system'
import MuiAddIcon from '@mui/icons-material/Add'
import { getNews, updateNewsStatus } from 'api/news'
import PageTitle from 'ui/PageTitle'
import UICard from 'ui/UICard'
import Header from './Card/Header'
import Body from './Card/Body'
import ReadOnlyModal from './ReadOnlyModal'

const NewsContainer = styled(Container)(
  ({ theme }) => `
  margin-bottom: ${theme.spacing(2)};
`
)

const Button = styled(MuiButton)(
  ({ theme }) => `
  color: ${theme.palette.orange500};
  background: ${theme.palette.newsBackground};
  border-radius: 8.35px;
`
)

const AddIcon = styled(MuiAddIcon)(
  ({ theme }) => `
  margin-right: ${theme.spacing(1)}
`
)

const News = () => {
  const [open, setOpen] = useState(false)
  const [news, setNews] = useState([])
  const [updatedNews, setUpdatedNews] = useState(null)

  const toggleEnableNews = async id => {
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

  const handleNewRiposte = () => {
    setNewRiposte(Riposte.NULL)
    setOpen(true)
  }

  const handleClick = id => () => {
    setUpdatedNews(news.find(n => n.id === id) || null)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
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
    <NewsContainer maxWidth="lg">
      <Grid container justifyContent="space-between">
        <Grid item>
          <PageTitle title={messages.title} />
        </Grid>
        <Grid item>
          <Button onClick={handleNewRiposte}>
            <AddIcon />
            {messages.create}
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {news.map(n => (
          <UICard key={n.id} header={<Header {...n} />} title={n.title} subtitle={`Par ${n.creator}`}>
            <Body news={n} handleClick={handleClick(n.id)} toggleStatus={toggleEnableNews} />
          </UICard>
        ))}
      </Grid>
      <ReadOnlyModal open={open} handleClose={handleClose} news={updatedNews} onSubmitRefresh={handleSubmitRefresh} />
    </NewsContainer>
  )
}

export default News
