import { Grid, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import NewsEnableStatus from './NewsEnableStatus'
import PropTypes from 'prop-types'
import News from 'domain/news'

const messages = {
  see: 'Voir',
}

const useStyles = makeStyles(theme => ({
  buttonContainer: {
    position: 'relative',
    bottom: '0',
  },
  editButton: {
    fontSize: '13px',
    fontWeight: '500',
    color: theme.palette.orange500,
    marginTop: theme.spacing(1.5),
    '&:hover': {
      background: theme.palette.newsBackground,
      borderRadius: '8.35px',
    },
  },
}))

const Body = ({ news, handleClickOpen, toggleStatus }) => {
  const classes = useStyles()
  const { id, status } = news

  return (
    <>
      <Grid container justifyContent="space-between" className={classes.buttonContainer}>
        <Grid item>
          <Button className={classes.editButton} onClick={() => handleClickOpen(id)}>
            {messages.see}
          </Button>
        </Grid>
        <Grid item>
          <NewsEnableStatus id={id} status={status} toggleStatus={toggleStatus} />
        </Grid>
      </Grid>
    </>
  )
}

Body.propTypes = {
  news: News.propTypes.isRequired,
  handleClickOpen: PropTypes.func.isRequired,
  toggleStatus: PropTypes.func.isRequired,
}

export default Body
