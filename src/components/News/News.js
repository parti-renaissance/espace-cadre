import { useState, useEffect } from 'react'
import { Container, makeStyles, Grid } from '@material-ui/core'
import { getNews } from 'api/news'
import UICard from 'ui/UICard'
import PageTitle from 'ui/PageTitle'

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
  pageTitle: 'Actualités',
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
        <PageTitle page={messages.pageTitle} xs={12} />
        <Grid container spacing={2}>
          {news.map(element => (
            <UICard key={element.id} element={element} type="news" />
          ))}
        </Grid>
      </Grid>
    </Container>
  )
}

export default News
