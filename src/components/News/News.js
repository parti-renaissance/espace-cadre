import { useState, useEffect } from 'react'
import { Container, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { getNews, updateNews } from 'api/news'
import PageTitle from 'ui/PageTitle'
import UICard from 'ui/UICard'
import Header from './Card/Header'
import Body from './Card/Body'
import NewsDetailsModal from './NewsDetailsModal'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    padding: 0,
  },
  newsContainer: {
    marginBottom: theme.spacing(2),
  },
  buttonContainer: {
    background: theme.palette.newsBackground,
    borderRadius: '8.35px',
    marginBottom: theme.spacing(4),
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  createButton: {
    color: theme.palette.orange500,
    padding: theme.spacing(0.75, 1),
  },
}))

const messages = {
  title: 'Actualités',
}

const News = () => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [news, setNews] = useState([])
  const [newNews, setNewNews] = useState(null)

  const toggleEnableNews = async id => {
    const info = news.find(n => n.id === id)
    const newNews = info.toggleStatus()
    setNews(prev =>
      prev
        .filter(n => n.id !== id)
        .concat(newNews)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    )
    await updateNews(newNews)
    getNews(setNews)
  }

  const handleClickOpen = id => {
    setNewNews(news.find(n => n.id === id) || null)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    getNews(setNews)
  }, [])

  return (
    <Container maxWidth="lg" className={classes.newsContainer} classes={{ root: classes.root }}>
      <Grid container justifyContent="space-between">
        <PageTitle title={messages.title} breakpoints={{ xs: 12 }} />
        <Grid container spacing={2}>
          {news?.map(n => (
            <UICard key={n.id} header={<Header {...n} />} title={n.title} subtitle={`Par ${n.creator}`}>
              <Body news={n} handleClickOpen={handleClickOpen} toggleStatus={toggleEnableNews} />
            </UICard>
          ))}
        </Grid>
        <NewsDetailsModal
          open={open}
          handleClose={handleClose}
          news={newNews}
          onSubmitRefresh={() => {
            getNews(setNews)
          }}
        />
      </Grid>
    </Container>
  )
}

export default News
