import { useState, useEffect } from 'react'
import { Container, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { getNews } from 'api/news'
import PageTitle from 'ui/PageTitle'
import UICard from 'ui/UICard'
import Header from './Header'

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
  const [news, setNews] = useState([])

  useEffect(() => {
    getNews(setNews)
  }, [])

  return (
    <Container maxWidth="lg" className={classes.newsContainer} classes={{ root: classes.root }}>
      <Grid container justifyContent="space-between">
        <PageTitle title={messages.title} breakpoints={{ xs: 12 }} />
        <Grid container spacing={2}>
          {news?.map(n => (
            <UICard key={n.id} header={<Header {...n} />} title={n.title} subtitle={`Par ${n.creator}`} />
          ))}
        </Grid>
      </Grid>
    </Container>
  )
}

export default News
