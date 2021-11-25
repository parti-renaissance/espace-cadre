import { useState, useEffect } from 'react'
import { Container, Grid } from '@mui/material'
import { styled } from '@mui/system'
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

const messages = {
  title: 'Actualités',
}

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

  return (
    <NewsContainer maxWidth="lg">
      <Grid container justifyContent="space-between">
        <PageTitle title={messages.title} breakpoints={{ xs: 12 }} />
        <Grid container spacing={2}>
          {news.map(n => (
            <UICard key={n.id} header={<Header {...n} />} title={n.title} subtitle={`Par ${n.creator}`}>
              <Body news={n} handleClick={handleClick(n.id)} toggleStatus={toggleEnableNews} />
            </UICard>
          ))}
        </Grid>
        <ReadOnlyModal open={open} handleClose={handleClose} news={updatedNews} onSubmitRefresh={handleSubmitRefresh} />
      </Grid>
    </NewsContainer>
  )
}

export default News
